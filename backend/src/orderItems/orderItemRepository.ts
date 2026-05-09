/**
 * @file orderItemRepository.ts
 * @purpose Provides direct database access for order item records.
 * @overview Wraps TypeORM operations for line items in customer orders.
 * @responsibilities Finds and creates order item rows.
 * @interaction Used by OrderItemService and OrdersRepository.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './orderItemEntity';

/**
 * Repository wrapper for order items.
 *
 * @class OrderItemRepository
 */
@Injectable()
export class OrderItemRepository {
  constructor(
    @InjectRepository(OrderItem)
    private readonly repository: Repository<OrderItem>,
  ) {}

  /**
   * Finds all items for one order.
   */
  async findByOrderId(orderId: number): Promise<OrderItem[]> {
    return this.repository.find({ where: { orderId } });
  }

  /**
   * Finds every order item for admin reporting.
   */
  async findAll(): Promise<OrderItem[]> {
    return this.repository.find({
      relations: ['order', 'order.user'],
      order: { orderItemId: 'DESC' },
    });
  }

  /**
   * Creates many order item entities for a parent order.
   */
  createMany(orderId: number, items: Array<{ itemType: string; itemId: number; price: number }>): OrderItem[] {
    return this.repository.create(items.map((item) => ({ ...item, orderId })));
  }

  /**
   * Persists order item entities.
   */
  async saveMany(items: OrderItem[]): Promise<OrderItem[]> {
    return this.repository.save(items);
  }
}
