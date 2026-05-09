/**
 * @file discountRepository.ts
 * @purpose Provides persistence operations for discount records.
 * @overview Keeps TypeORM-specific discount querying isolated from business rules.
 * @responsibilities Reads, creates, updates, and deletes rows from the `discounts` table.
 * @interaction Used by DiscountService and pricing workflows.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discount } from './discountEntity';
import { CreateDiscountDto, UpdateDiscountDto } from './discountDto';

/**
 * Repository wrapper for discounts.
 *
 * @class DiscountRepository
 */
@Injectable()
export class DiscountRepository {
  constructor(
    @InjectRepository(Discount)
    private readonly repository: Repository<Discount>,
  ) {}

  /**
   * Retrieves all discount records.
   */
  async findAll(): Promise<Discount[]> {
    return this.repository.find({ relations: ['game'] });
  }

  /**
   * Finds a discount by ID.
   */
  async findById(discountId: number): Promise<Discount | null> {
    return this.repository.findOne({ where: { discountId }, relations: ['game'] });
  }

  /**
   * Finds discounts attached to one game.
   */
  async findByGameId(gameId: number): Promise<Discount[]> {
    return this.repository.find({ where: { gameId }, relations: ['game'] });
  }

  /**
   * Persists a new discount.
   */
  async create(dto: CreateDiscountDto): Promise<Discount> {
    const discount = this.repository.create(dto);
    return this.repository.save(discount);
  }

  /**
   * Updates a discount and returns the refreshed entity.
   */
  async update(discountId: number, dto: UpdateDiscountDto): Promise<Discount | null> {
    await this.repository.update(discountId, dto);
    return this.findById(discountId);
  }

  /**
   * Deletes a discount.
   */
  async remove(discountId: number): Promise<void> {
    await this.repository.delete(discountId);
  }
}
