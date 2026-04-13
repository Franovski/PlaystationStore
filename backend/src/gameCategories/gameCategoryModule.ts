import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameCategory } from './gameCategoryEntity';
import { GameCategoryController } from './gameCategoryController';
import { GameCategoryService } from './gameCategoryService';
import { GameCategoryRepository } from './gameCategoryRepository';
import { GameModule } from '../games/gameModule';
import { CategoryModule } from '../categories/categoryModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameCategory]),
    GameModule,
    CategoryModule,
  ],
  controllers: [GameCategoryController],
  providers: [GameCategoryService, GameCategoryRepository],
  exports: [GameCategoryService],
})
export class GameCategoryModule {}