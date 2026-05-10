/**
 * @file reviewEntity.ts
 * @purpose Defines customer game reviews.
 * @overview Maps user ratings and comments into the `reviews` table and links each review to a user and game.
 * @responsibilities Stores rating, optional comment, creation/update timestamps, and ownership references.
 * @interaction Used by game detail pages, review mutations, and dashboard validation flows.
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Game } from '../games/gameEntity';
import { User } from '../users/userEntity';

/**
 * Represents one customer review for a game.
 *
 * @class Review
 */
@ObjectType()
@Entity('reviews')
@Unique(['userId', 'gameId'])
export class Review {
  /**
   * Unique review identifier.
   */
  @Field(() => Int)
  @PrimaryGeneratedColumn({ name: 'review_id' })
  reviewId: number;

  /**
   * Numeric rating from 1 to 5.
   */
  @Field(() => Int)
  @Column({ type: 'integer' })
  rating: number;

  /**
   * Optional review comment.
   */
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  comment: string | null;

  /**
   * Timestamp when the review was created.
   */
  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  /**
   * Timestamp when the review was last updated.
   */
  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  /**
   * Authoring user identifier.
   */
  @Field(() => ID)
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  /**
   * Reviewed game identifier.
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
