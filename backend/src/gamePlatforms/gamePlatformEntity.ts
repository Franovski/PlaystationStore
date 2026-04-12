import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Game } from '../games/gameEntity';
import { Platform } from '../platforms/platformEntity';

@Entity('game_platforms')
export class GamePlatform {
  @PrimaryColumn({ name: 'game_id' })
  gameId: number;

  @PrimaryColumn({ name: 'platform_id' })
  platformId: number;

  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @ManyToOne(() => Platform, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'platform_id' })
  platform: Platform;
}
