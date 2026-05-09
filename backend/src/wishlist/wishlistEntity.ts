/**
 * @file wishlistEntity.ts
 * @purpose Defines the customer wishlist entity.
 * @overview Maps users saving games for later into the `wishlist` table.
 * @responsibilities Stores user/game wishlist pairs and prevents duplicate saved games per user.
 * @interaction Used by wishlist services, customer dashboard aggregation, and storefront actions.
 */
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Game } from '../games/gameEntity';
import { User } from '../users/userEntity';

/**
 * Represents one saved wishlist game for a user.
 *
 * @class Wishlist
 */
@ObjectType()
@Entity('wishlist')
@Unique(['userId', 'gameId'])
export class Wishlist {
  /**
   * Unique wishlist row identifier.
   */
  @Field(() => Int)
  @PrimaryGeneratedColumn({ name: 'wishlist_id' })
  wishlistId: number;

  /**
   * Time at which the game was added.
   */
  @Field(() => Date)
  @CreateDateColumn({ name: 'added_at', type: 'timestamptz' })
  addedAt: Date;

  /**
   * Owning user identifier.
   */
  @Field(() => ID)
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  /**
   * Saved game identifier.
   */
  @Field(() => Int)
  @Column({ name: 'game_id' })
  gameId: number;

  /**
   * Optional loaded user relation.
   */
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  /**
   * Optional loaded game relation.
   */
  @Field(() => Game, { nullable: true })
  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game?: Game;
}
