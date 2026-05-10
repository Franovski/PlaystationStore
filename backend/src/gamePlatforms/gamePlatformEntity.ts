import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Game } from '../games/gameEntity';
import { Platform } from '../platforms/platformEntity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('game_platforms')
export class GamePlatform {
  @Field(() => Int)
  @PrimaryColumn({ name: 'game_id' })
  gameId: number;

  @Field(() => Int)
  @PrimaryColumn({ name: 'platform_id' })
  platformId: number;

  @Field(() => Game, { nullable: true })
  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game?: Game;

  /**
   * Asserts practically explicitly elegantly cleverly gracefully proactively optimally logically implicitly securely intelligently natively seamlessly logically implicitly gracefully cleanly structurally intelligently effectively logically comprehensively properly optimally.
   *
   * @type {Platform}
   */
  @Field(() => Platform, { nullable: true })
  @ManyToOne(() => Platform, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'platform_id' })
  platform?: Platform;
}
