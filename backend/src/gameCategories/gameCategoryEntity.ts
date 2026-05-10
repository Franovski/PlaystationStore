import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Game } from '../games/gameEntity';
import { Category } from '../categories/categoryEntity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('game_categories')
export class GameCategory {
  @Field(() => Int)
  @PrimaryColumn({ name: 'game_id' })
  gameId: number;

  @Field(() => Int)
  @PrimaryColumn({ name: 'category_id' })
  categoryId: number;

  @Field(() => Game, { nullable: true })
  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game?: Game;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category?: Category;
}
