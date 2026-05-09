/**
 * @file orderItemService.ts
 * @purpose Contains read-side authorization for order item access.
 * @overview Ensures users can only read items belonging to their own orders unless they are admins.
 * @responsibilities Validates order ownership and delegates item lookup to the repository.
 * @interaction Used by OrderItemResolver.
 */
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './orderItemEntity';
import { OrderItemRepository } from './orderItemRepository';
import { Order } from '../orders/orderEntity';
import { UserRole } from '../users/userEntity';

/**
 * Service for order item reads.
 *
 * @class OrderItemService
 */
@Injectable()
export class OrderItemService {
  constructor(
    private readonly orderItemRepository: OrderItemRepository,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * Returns items for an order after ownership checks.
   */
  async getItemsForOrder(orderId: number, userId: string, role?: string): Promise<OrderItem[]> {
    this.validateId(orderId, 'Order ID');

    const order = await this.orderRepository.findOne({ where: { orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.userId !== userId && role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only view items from your own orders');
    }

    return this.orderItemRepository.findByOrderId(orderId);
  }

  /**
   * Returns all order items for admin management views.
   */
  async getAllItems(): Promise<OrderItem[]> {
    return this.orderItemRepository.findAll();
  }

  private validateId(id: number, fieldName: string): void {
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException(`${fieldName} must be a positive integer`);
    }
  }
}
