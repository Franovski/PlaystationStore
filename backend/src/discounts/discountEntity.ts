/**
 * @file discountEntity.ts
 * @purpose Defines game-level discount records.
 * @overview Maps active or scheduled discounts to the `discounts` table and connects each discount to a game.
 * @responsibilities Stores percentage values, valid date windows, and parent game references.
 * @interaction Used by storefront pricing, order total calculation, and admin discount management.
 */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Game } from '../games/gameEntity';

/**
 * Represents a date-bound percentage discount for a game.
 *
 * @class Discount
 */
@ObjectType()
@Entity('discounts')
export class Discount {
  /**
   * Unique identifier for the discount.
   */
  @Field(() => Int)
  @PrimaryGeneratedColumn({ name: 'discount_id' })
  discountId: number;

  /**
   * Discount percentage from 0 to 100.
   */
  @Field(() => Float)
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;

  /**
   * First date on which the discount is valid.
   */
  @Field()
  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  /**
   * Last date on which the discount is valid.
   */
  @Field()
  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  /**
   * Identifier of the discounted game.
   */
  @Field(() => Int)
  @Column({ name: 'game_id' })
  gameId: number;

  /**
   * Optional loaded game relation.
   */
  @Field(() => Game, { nullable: true })
  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game?: Game;
}
