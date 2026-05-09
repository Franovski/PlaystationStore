/**
 * @file discountService.ts
 * @purpose Contains discount business logic and price calculation support.
 * @overview Validates discount date ranges, percentage values, game references, and active discount windows.
 * @responsibilities Provides CRUD operations and calculates effective game prices for purchase flows.
 * @interaction Used by DiscountResolver, StorefrontService, and OrdersService.
 */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Discount } from './discountEntity';
import { CreateDiscountDto, UpdateDiscountDto } from './discountDto';
import { DiscountRepository } from './discountRepository';
import { GameService } from '../games/gameService';

/**
 * Service class for discount rules.
 *
 * @class DiscountService
 */
@Injectable()
export class DiscountService {
  constructor(
    private readonly repository: DiscountRepository,
    private readonly gameService: GameService,
  ) {}

  /**
   * Retrieves all discounts.
   */
  async getAllDiscounts(): Promise<Discount[]> {
    return this.repository.findAll();
  }

  /**
   * Retrieves a discount by ID.
   */
  async getDiscountById(id: number): Promise<Discount> {
    this.validateId(id, 'Discount ID');

    const discount = await this.repository.findById(id);
    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }

    return discount;
  }

  /**
   * Retrieves discounts for a game.
   */
  async getDiscountsByGameId(gameId: number): Promise<Discount[]> {
    this.validateId(gameId, 'Game ID');
    await this.gameService.getGameById(gameId);
    return this.repository.findByGameId(gameId);
  }

  /**
   * Retrieves discounts valid on the supplied date.
   */
  async getActiveDiscountsForGame(gameId: number, date: Date = new Date()): Promise<Discount[]> {
    const discounts = await this.getDiscountsByGameId(gameId);
    const normalizedDate = this.normalizeDateOnly(date);

    return discounts.filter((discount) => {
      const start = this.parseDate(discount.startDate, 'Discount start date');
      const end = this.parseDate(discount.endDate, 'Discount end date');
      return start <= normalizedDate && normalizedDate <= end;
    });
  }

  /**
   * Retrieves the strongest active discount for a game.
   */
  async getBestActiveDiscountForGame(gameId: number): Promise<Discount | null> {
    const activeDiscounts = await this.getActiveDiscountsForGame(gameId);
    if (activeDiscounts.length === 0) {
      return null;
    }

    return activeDiscounts.reduce((best, discount) =>
      Number(discount.percentage) > Number(best.percentage) ? discount : best,
    );
  }

  /**
   * Applies the best active game discount to a base price.
   */
  async calculateDiscountedGamePrice(gameId: number, basePrice: number): Promise<number> {
    const discount = await this.getBestActiveDiscountForGame(gameId);
    if (!discount) {
      return this.roundCurrency(basePrice);
    }

    const discounted = basePrice * (1 - Number(discount.percentage) / 100);
    return this.roundCurrency(discounted);
  }

  /**
   * Creates a discount.
   */
  async createDiscount(dto: CreateDiscountDto): Promise<Discount> {
    this.validatePercentage(dto.percentage);
    this.validateDateRange(dto.startDate, dto.endDate);
    this.validateId(dto.gameId, 'Game ID');
    await this.gameService.getGameById(dto.gameId);

    return this.repository.create(dto);
  }

  /**
   * Updates a discount.
   */
  async updateDiscount(id: number, dto: UpdateDiscountDto): Promise<Discount> {
    this.validateId(id, 'Discount ID');
    const existing = await this.getDiscountById(id);

    if (Object.keys(dto).length === 0) {
      return existing;
    }

    if (dto.percentage !== undefined) {
      this.validatePercentage(dto.percentage);
    }
    if (dto.gameId !== undefined) {
      this.validateId(dto.gameId, 'Game ID');
      await this.gameService.getGameById(dto.gameId);
    }

    const finalStartDate = dto.startDate ?? existing.startDate;
    const finalEndDate = dto.endDate ?? existing.endDate;
    this.validateDateRange(finalStartDate, finalEndDate);

    const discount = await this.repository.update(id, dto);
    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found after update attempt`);
    }

    return discount;
  }

  /**
   * Deletes a discount.
   */
  async deleteDiscount(id: number): Promise<void> {
    await this.getDiscountById(id);
    await this.repository.remove(id);
  }

  private validateId(id: number, fieldName: string): void {
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException(`${fieldName} must be a positive integer`);
    }
  }

  private validatePercentage(percentage: number): void {
    if (typeof percentage !== 'number' || Number.isNaN(percentage) || !Number.isFinite(percentage)) {
      throw new BadRequestException('Discount percentage must be a valid number');
    }

    if (percentage < 0 || percentage > 100) {
      throw new BadRequestException('Discount percentage must be between 0 and 100');
    }
  }

  private validateDateRange(startDateValue: string, endDateValue: string): void {
    const startDate = this.parseDate(startDateValue, 'Discount start date');
    const endDate = this.parseDate(endDateValue, 'Discount end date');

    if (startDate > endDate) {
      throw new BadRequestException('Discount start date cannot be after end date');
    }
  }

  private parseDate(value: string, fieldName: string): Date {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(`${fieldName} must be a valid date`);
    }

    return this.normalizeDateOnly(parsed);
  }

  private normalizeDateOnly(value: Date): Date {
    const normalized = new Date(value);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  private roundCurrency(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
