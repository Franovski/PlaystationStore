/**
 * @file orderRepository.ts
 * @purpose Provides direct database access for order records.
 * @overview Wraps TypeORM operations for orders and cascaded order item persistence.
 * @responsibilities Creates orders, reads user order history, and loads item relations.
 * @interaction Used by OrdersService and dashboard aggregation.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orderEntity';
import { OrderItem } from '../orderItems/orderItemEntity';

/**
 * Repository wrapper for customer orders.
 *
 * @class OrderRepository
 */
@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  /**
   * Finds all orders for a user with item rows loaded.
   */
  async findByUserId(userId: string): Promise<Order[]> {
    return this.repository.find({
      where: { userId },
      relations: ['items'],
      order: { orderDate: 'DESC' },
    });
  }

  /**
   * Finds all orders for admin management with owner and item rows loaded.
   */
  async findAll(): Promise<Order[]> {
    return this.repository.find({
      relations: ['items', 'user'],
      order: { orderDate: 'DESC' },
    });
  }

  /**
   * Finds one order by ID.
   */
  async findById(orderId: number): Promise<Order | null> {
    return this.repository.findOne({ where: { orderId }, relations: ['items'] });
  }

  /**
   * Creates an order and cascades its line items.
   */
  async createOrder(
    userId: string,
    paymentMethod: string,
    status: string,
    totalPrice: number,
    items: Array<{ itemType: string; itemId: number; price: number }>,
  ): Promise<Order> {
    const order = await this.repository.save(this.repository.create({
      userId,
      paymentMethod,
      status,
      totalPrice,
    }));

    const orderItems = this.orderItemRepository.create(
      items.map((item) => ({
        ...item,
        orderId: order.orderId,
      })),
    );

    order.items = await this.orderItemRepository.save(orderItems);
    return order;
  }
}
