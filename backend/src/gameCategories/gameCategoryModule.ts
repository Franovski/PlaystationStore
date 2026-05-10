import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameCategory } from './gameCategoryEntity';
import { GameCategoryService } from './gameCategoryService';
import { GameCategoryRepository } from './gameCategoryRepository';
import { GameModule } from '../games/gameModule';
import { CategoryModule } from '../categories/categoryModule';
import { GameCategoryResolver } from './gameCategoryResolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameCategory]),
    GameModule,
    CategoryModule,
  ],
  providers: [
    GameCategoryService,
    GameCategoryRepository,
    GameCategoryResolver,
  ],
  exports: [GameCategoryService],
})
export class GameCategoryModule {}
