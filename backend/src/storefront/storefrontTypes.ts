/**
 * @file storefrontTypes.ts
 * @purpose Defines GraphQL object types for customer-facing store detail screens.
 * @overview Aggregates normalized game information with related DLCs, editions, categories, platforms, discounts, and reviews.
 * @responsibilities Provides stable response shapes that do not require loading nullable relations directly on the Game entity.
 * @interaction Returned by StorefrontResolver for browsing and game detail views.
 */
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Game } from '../games/gameEntity';
import { DLC } from '../dlc/dlcEntity';
import { Edition } from '../editions/editionEntity';
import { Category } from '../categories/categoryEntity';
import { Platform } from '../platforms/platformEntity';
import { Discount } from '../discounts/discountEntity';
import { Review } from '../reviews/reviewEntity';

/**
 * Aggregated customer-facing game detail shape.
 *
 * @class GameDetails
 */
@ObjectType()
export class GameDetails {
  /**
   * Core game record.
   */
  @Field(() => Game)
  game: Game;

  /**
   * Current effective price after active game discounts.
   */
  @Field(() => Float)
  currentPrice: number;

  /**
   * Active discount percentage applied to currentPrice, if any.
   */
  @Field(() => Float, { nullable: true })
  activeDiscountPercentage?: number | null;

  /**
   * DLCs attached to the game.
   */
  @Field(() => [DLC])
  dlcs: DLC[];

  /**
   * Editions attached to the game.
   */
  @Field(() => [Edition])
  editions: Edition[];

  /**
   * Categories linked to the game.
   */
  @Field(() => [Category])
  categories: Category[];

  /**
   * Platforms linked to the game.
   */
  @Field(() => [Platform])
  platforms: Platform[];

  /**
   * All discounts configured for the game.
   */
  @Field(() => [Discount])
  discounts: Discount[];

  /**
   * Reviews written for the game.
   */
  @Field(() => [Review])
  reviews: Review[];
}
