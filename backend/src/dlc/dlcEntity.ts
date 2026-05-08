/**
 * @file dlcEntity.ts
 * @purpose Defines the database entity model for downloadable content linked to games.
 * @overview Represents DLC records that belong to a specific game and can be purchased or displayed separately.
 * @responsibilities Maps DLC data into the `dlc` table and connects each DLC entry to its parent Game entity.
 * @interaction Referenced by Game-related queries, order items, user libraries, and any feature that needs DLC ownership or pricing information.
 */

import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from '../games/gameEntity';

/**
 * Downloadable content entity.
 *
 * @class DLC
 * @description Represents an additional purchasable content item associated with a specific game.
 */
@ObjectType()
@Entity('dlc')
export class DLC {
  /**
   * Unique identifier for the DLC.
   *
   * @type {number}
   */
  @Field(() => Int)
  @PrimaryGeneratedColumn({ name: 'dlc_id' })
  dlcId: number;

  /**
   * Name of the downloadable content.
   *
   * @type {string}
   */
  @Field()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /**
   * Price of the downloadable content.
   *
   * @type {number}
   */
  @Field()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  /**
   * Optional release date of the DLC.
   *
   * @type {string}
   */
  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  releaseDate: string;

  /**
   * Identifier of the game this DLC belongs to.
   *
   * @type {number}
   */
  @Field(() => Int)
  @Column({ name: 'game_id' })
  gameId: number;

  /**
   * Related game entity.
   *
   * @type {Game}
   */
  @Field(() => Game, { nullable: true })
  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game?: Game;
}