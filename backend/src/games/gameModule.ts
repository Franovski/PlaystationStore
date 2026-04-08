import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './gameEntity';
import { GameController } from './gameController';
import { GameService } from './gameService';
import { GameRepository } from './gameRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  controllers: [GameController],
  providers: [GameService, GameRepository],
  exports: [GameService, GameRepository], // Both might be heavily used by other modules (Orders, Reviews, Wishlist)
})
export class GameModule {}