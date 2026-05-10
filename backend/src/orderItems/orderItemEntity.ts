/**
 * @file orderItemEntity.ts
 * @purpose Defines individual purchasable items contained inside an order.
 * @overview Maps order line items to the `order_items` table using item type and item ID references.
 * @responsibilities Stores item type, item identifier, captured price, and parent order linkage.
 * @interaction Used by order creation, order history, and customer purchase views.
 */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Order } from '../orders/orderEntity';
import { Game } from '../games/gameEntity';
import { DLC } from '../dlc/dlcEntity';
import { Edition } from '../editions/editionEntity';

/**
 * Represents one purchased item inside an order.
 *
 * @class OrderItem
 */
@ObjectType()
@Entity('order_items')
export class OrderItem {
  /**
   * Unique order item identifier.
   */
  @Field(() => Int)
  @PrimaryGeneratedColumn({ name: 'order_item_id' })
  orderItemId: number;

  /**
   * Purchased item type: game, dlc, or edition.
   */
  @Field()
  @Column({ name: 'item_type', type: 'varchar', length: 50 })
  itemType: string;

  /**
   * Identifier of the purchased item in its own table.
   */
  @Field(() => Int)
  @Column({ name: 'item_id' })
  itemId: number;

  /**
   * Captured price at purchase time.
   */
  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  /**
   * Parent order identifier.
   */
  @Field(() => Int)
  @Column({ name: 'order_id' })
  orderId: number;

  /**
   * Optional loaded parent order relation.
   */
  @Field(() => Order, { nullable: true })
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order?: Order;

  /**
   * Optional resolved game when this line item purchased a game.
   */
  @Field(() => Game, { nullable: true })
  game?: Game | null;

  /**
   * Optional resolved DLC when this line item purchased DLC.
   */
  @Field(() => DLC, { nullable: true })
  dlc?: DLC | null;

  /**
   * Optional resolved edition when this line item purchased an edition.
   */
  @Field(() => Edition, { nullable: true })
  edition?: Edition | null;
}
