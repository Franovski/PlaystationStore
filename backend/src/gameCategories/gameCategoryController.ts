import { Controller, Post, Delete, Get, Param, ParseIntPipe, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { GameCategoryService } from './gameCategoryService';
import { AddGameCategoryDto } from './gameCategoryDto';

@Controller('game-categories')
export class GameCategoryController {
  constructor(private readonly gameCategoryService: GameCategoryService) {}

  @Post()
  async assignCategoryToGame(@Body() dto: AddGameCategoryDto) {
    return this.gameCategoryService.linkGameAndCategory(dto);
  }

  @Delete('game/:gameId/category/:categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeCategoryFromGame(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.gameCategoryService.unlinkGameAndCategory(gameId, categoryId);
  }

  @Get('game/:gameId')
  async getCategoriesForGame(@Param('gameId', ParseIntPipe) gameId: number) {
    return this.gameCategoryService.getCategoriesByGame(gameId);
  }

  @Get('category/:categoryId')
  async getGamesForCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.gameCategoryService.getGamesByCategory(categoryId);
  }
}