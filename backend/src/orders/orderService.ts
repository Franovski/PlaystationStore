/**
 * @file orderService.ts
 * @purpose Contains purchase and order history business logic.
 * @overview Validates purchasable items, calculates totals server-side, applies game discounts, and handles wallet payment rules.
 * @responsibilities Prevents duplicate ownership, validates wallet balance, creates orders, deducts wallet funds, and grants library ownership.
 * @interaction Used by OrdersResolver and customer dashboard aggregation.
 */
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './orderEntity';
import { CreateOrderDto } from './orderDto';
import { OrderRepository } from './orderRepository';
import { GameService } from '../games/gameService';
import { DLCService } from '../dlc/dlcService';
import { EditionService } from '../editions/editionService';
import { DiscountService } from '../discounts/discountService';
import { UserWalletService } from '../userWallet/userWalletService';
import { UserLibraryService } from '../userLibrary/userLibraryService';
import { UserRole } from '../users/userEntity';

type ResolvedOrderItem = {
  itemType: string;
  itemId: number;
  price: number;
};

/**
 * Service class for order workflows.
 *
 * @class OrdersService
 */
@Injectable()
export class OrdersService {
  private readonly supportedPaymentMethods = ['wallet', 'card'];
  private readonly supportedItemTypes = ['game', 'dlc', 'edition'];

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly gameService: GameService,
    private readonly dlcService: DLCService,
    private readonly editionService: EditionService,
    private readonly discountService: DiscountService,
    private readonly walletService: UserWalletService,
    private readonly libraryService: UserLibraryService,
  ) {}

  /**
   * Retrieves the current user's orders.
   */
  async getOrdersForUser(userId: string): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }

  /**
   * Retrieves every order for admin management.
   */
  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  /**
   * Retrieves one order after checking ownership or admin role.
   */
  async getOrderForUser(orderId: number, userId: string, role?: string): Promise<Order> {
    this.validateId(orderId, 'Order ID');

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.userId !== userId && role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only view your own orders');
    }

    return order;
  }

  /**
   * Creates a purchase order from requested item references.
   */
  async createOrder(userId: string, dto: CreateOrderDto): Promise<Order> {
    const paymentMethod = this.normalizePaymentMethod(dto.paymentMethod);
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must include at least one item');
    }

    const seenItems = new Set<string>();
    const resolvedItems: ResolvedOrderItem[] = [];

    for (const item of dto.items) {
      const normalizedType = this.normalizeItemType(item.itemType);
      this.validateId(item.itemId, 'Item ID');

      const itemKey = `${normalizedType}:${item.itemId}`;
      if (seenItems.has(itemKey)) {
        throw new BadRequestException('Duplicate items are not allowed in the same order');
      }
      seenItems.add(itemKey);

      const alreadyOwned = await this.libraryService.hasOwnership(userId, normalizedType, item.itemId);
      if (alreadyOwned) {
        throw new BadRequestException(`You already own this ${normalizedType}`);
      }

      resolvedItems.push(await this.resolvePurchasableItem(normalizedType, item.itemId));
    }

    const totalPrice = this.roundCurrency(
      resolvedItems.reduce((sum, item) => sum + item.price, 0),
    );

    if (paymentMethod === 'wallet') {
      await this.walletService.validateSufficientBalance(userId, totalPrice);
    }

    const order = await this.orderRepository.createOrder(
      userId,
      paymentMethod,
      'completed',
      totalPrice,
      resolvedItems,
    );

    if (paymentMethod === 'wallet') {
      await this.walletService.deductFunds(userId, totalPrice);
    }

    for (const item of resolvedItems) {
      await this.libraryService.grantOwnership(userId, item.itemType, item.itemId);
    }

    return this.getOrderForUser(order.orderId, userId);
  }

  private async resolvePurchasableItem(itemType: string, itemId: number): Promise<ResolvedOrderItem> {
    if (itemType === 'game') {
      const game = await this.gameService.getGameById(itemId);
      const basePrice = Number(game.basePrice);
      const price = await this.discountService.calculateDiscountedGamePrice(game.gameId, basePrice);
      return { itemType, itemId, price };
    }

    if (itemType === 'dlc') {
      const dlc = await this.dlcService.getDLCById(itemId);
      return { itemType, itemId, price: this.roundCurrency(Number(dlc.price)) };
    }

    if (itemType === 'edition') {
      const edition = await this.editionService.getEditionById(itemId);
      return { itemType, itemId, price: this.roundCurrency(Number(edition.price)) };
    }

    throw new BadRequestException('Unsupported item type');
  }

  private normalizePaymentMethod(paymentMethod: string): string {
    const normalized = String(paymentMethod || '').trim().toLowerCase();
    if (!this.supportedPaymentMethods.includes(normalized)) {
      throw new BadRequestException('paymentMethod must be one of: wallet, card');
    }

    return normalized;
  }

  private normalizeItemType(itemType: string): string {
    const normalized = String(itemType || '').trim().toLowerCase();
    if (!this.supportedItemTypes.includes(normalized)) {
      throw new BadRequestException('itemType must be one of: game, dlc, edition');
    }

    return normalized;
  }

  private validateId(id: number, fieldName: string): void {
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException(`${fieldName} must be a positive integer`);
    }
  }

  private roundCurrency(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
