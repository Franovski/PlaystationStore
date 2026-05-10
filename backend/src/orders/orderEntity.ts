/**
 * @file orderEntity.ts
 * @purpose Defines customer order records.
 * @overview Maps completed purchase attempts into the `orders` table and links each order to a user and its line items.
 * @responsibilities Stores payment method, order status, calculated total, and order date.
 * @interaction Used by purchase creation, wallet payments, library fulfillment, and customer order history.
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../users/userEntity';
import { OrderItem } from '../orderItems/orderItemEntity';

/**
 * Represents a customer purchase order.
 *
 * @class Order
 */
@ObjectType()
@Entity('orders')
export class Order {
  /**
   * Unique order identifier.
   */
  @Field(() => Int)
  @PrimaryGeneratedColumn({ name: 'order_id' })
  orderId: number;

  /**
   * Timestamp when the order was created.
   */
  @Field(() => Date)
  @CreateDateColumn({ name: 'order_date', type: 'timestamptz' })
  orderDate: Date;

  /**
   * Server-calculated order total.
   */
  @Field(() => Float)
  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  /**
   * Payment method used for the order.
   */
  @Field()
  @Column({ name: 'payment_method', type: 'varchar', length: 50 })
  paymentMethod: string;

  /**
   * Order status.
   */
  @Field()
  @Column({ type: 'varchar', length: 50, default: 'completed' })
  status: string;

  /**
   * Owning user identifier.
   */
  @Field(() => ID)
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  /**
   * Optional loaded user relation.
   */
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  /**
   * Optional loaded order item relations.
   */
  @Field(() => [OrderItem], { nullable: true })
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items?: OrderItem[];
}
