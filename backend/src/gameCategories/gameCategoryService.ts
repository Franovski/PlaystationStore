import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { GameCategoryRepository } from './gameCategoryRepository';
import { GameService } from '../games/gameService';
import { CategoryService } from '../categories/categoryService';
import { AddGameCategoryDto } from './gameCategoryDto';
import { GameCategory } from './gameCategoryEntity';

@Injectable()
export class GameCategoryService {
  constructor(
    private readonly gameCategoryRepository: GameCategoryRepository,
    private readonly gameService: GameService,
    private readonly categoryService: CategoryService,
  ) {}

  async linkGameAndCategory(dto: AddGameCategoryDto): Promise<GameCategory> {
    // 1. Verify existence of game
    await this.gameService.getGameById(dto.gameId);

    // 2. Verify existence of category
    await this.categoryService.getCategoryById(dto.categoryId);

    // 3. Ensure no duplicate mappings exist
    const existing = await this.gameCategoryRepository.checkLink(dto.gameId, dto.categoryId);
    if (existing) {
      throw new ConflictException(`Game ID ${dto.gameId} is already linked with Category ID ${dto.categoryId}`);
    }

    return this.gameCategoryRepository.link(dto.gameId, dto.categoryId);
  }

  async unlinkGameAndCategory(gameId: number, categoryId: number): Promise<void> {
    const existing = await this.gameCategoryRepository.checkLink(gameId, categoryId);
    if (!existing) {
      throw new NotFoundException(`Link between Game ID ${gameId} and Category ID ${categoryId} not found`);
    }
    await this.gameCategoryRepository.unlink(gameId, categoryId);
  }

  async getCategoriesByGame(gameId: number) {
    // Validate game
    await this.gameService.getGameById(gameId);

    const mappings = await this.gameCategoryRepository.findByGame(gameId);
    return mappings.map((mapping) => mapping.category);
  }

  async getGamesByCategory(categoryId: number) {
    // Validate category
    await this.categoryService.getCategoryById(categoryId);

    const mappings = await this.gameCategoryRepository.findByCategory(categoryId);
    return mappings.map((mapping) => mapping.game);
  }
}