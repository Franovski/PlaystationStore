/**
 * @file editionEntity.ts
 * @purpose Defines purchasable game editions such as standard, deluxe, or ultimate packages.
 * @overview Maps edition records to the `editions` table and links each edition to its parent game.
 * @responsibilities Stores edition pricing, included content notes, and the owning game reference.
 * @interaction Used by edition services, order validation, library ownership, and storefront game detail queries.
 */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Game } from '../games/gameEntity';

/**
 * Represents a purchasable edition of a game.
 *
 * @class Edition
 * @description Holds edition-specific names, prices, and included content while preserving the parent Game relationship.
 */
@ObjectType()
@Entity('editions')
@Unique(['gameId', 'name'])
export class Edition {
  /**
   * Unique identifier for the edition.
   *
   * @type {number}
   */
  @Field(() => Int)
  @PrimaryGeneratedColumn({ name: 'edition_id' })
  editionId: number;

  /**
   * Human-readable edition name.
   *
   * @type {string}
   */
  @Field()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /**
   * Purchasable price for this edition.
   *
   * @type {number}
   */
  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  /**
   * Optional content summary describing what the edition includes.
   *
   * @type {string | null}
   */
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  includes: string | null;

  /**
   * Identifier of the game this edition belongs to.
   *
   * @type {number}
   */
  @Field(() => Int)
  @Column({ name: 'game_id' })
  gameId: number;

  /**
   * Optional loaded game relation.
   *
   * @type {Game | undefined}
   */
  @Field(() => Game, { nullable: true })
  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game?: Game;
}
