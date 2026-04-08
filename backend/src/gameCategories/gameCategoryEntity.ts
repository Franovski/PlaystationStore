import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Game } from '../games/gameEntity';
import { Category } from '../categories/categoryEntity';

@Entity('game_categories')
export class GameCategory {
  @PrimaryColumn({ name: 'game_id' })
  gameId: number;

  @PrimaryColumn({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}