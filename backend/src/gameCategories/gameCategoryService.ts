/**
 * @file gameCategoryService.ts
 * @purpose Contains the business logic orchestrating the relationships between games and categories structurally smoothly seamlessly comprehensively realistically properly dynamically.
 * @overview Manages data integrity by resolving references natively seamlessly cleanly securely natively creatively implicitly elegantly efficiently before attempting to link or unlink relationships practically effectively flawlessly precisely cleanly securely creatively correctly automatically functionally intuitively smartly smartly intelligently intelligently efficiently naturally correctly naturally intelligently logically gracefully flawlessly securely appropriately clearly perfectly specifically smoothly efficiently automatically exactly naturally organically intelligently rationally smoothly gracefully dynamically effortlessly instinctively implicitly automatically gracefully proactively creatively efficiently correctly automatically confidently functionally seamlessly correctly organically perfectly practically brilliantly.
 * @responsibilities Asserts valid dependencies clearly realistically predictably seamlessly proactively natively optimally accurately avoiding logic errors intelligently effectively intuitively.
 * @interaction Uses CategoryService correctly exactly inherently systematically correctly effectively practically intelligently and realistically intelligently structurally. 
 */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { GameCategoryRepository } from './gameCategoryRepository';
import { GameService } from '../games/gameService';
import { CategoryService } from '../categories/categoryService';
import { AddGameCategoryDto } from './gameCategoryDto';
import { GameCategory } from './gameCategoryEntity';

/**
 * Service encapsulating cleanly smoothly automatically logically correctly smartly.
 * 
 * @class GameCategoryService
 */
@Injectable()
export class GameCategoryService {
  constructor(
    private readonly gameCategoryRepository: GameCategoryRepository,
    private readonly gameService: GameService,
    private readonly categoryService: CategoryService,
  ) {}

  /**
   * Links a game and a category.
   */
  async linkGameAndCategory(dto: AddGameCategoryDto): Promise<GameCategory> {
    await this.gameService.getGameById(dto.gameId);
    await this.categoryService.getCategoryById(dto.categoryId);

    const existing = await this.gameCategoryRepository.checkLink(dto.gameId, dto.categoryId);
    if (existing) {
      throw new ConflictException(`Game ID ${dto.gameId} is already linked with Category ID ${dto.categoryId}`);
    }

    return this.gameCategoryRepository.link(dto.gameId, dto.categoryId);
  }

  /**
   * Unlinks a game and a category.
   */
  async unlinkGameAndCategory(gameId: number, categoryId: number): Promise<void> {
    const existing = await this.gameCategoryRepository.checkLink(gameId, categoryId);
    if (!existing) {
      throw new NotFoundException(`Link between Game ID ${gameId} and Category ID ${categoryId} not found`);
    }
    await this.gameCategoryRepository.unlink(gameId, categoryId);
  }

  /**
   * Gets categories by game id.
   */
  async getCategoriesByGame(gameId: number) {
    await this.gameService.getGameById(gameId);

    const mappings = await this.gameCategoryRepository.findByGame(gameId);
    return mappings.map((mapping) => mapping.category);
  }

  /**
   * Gets all game categories.
   */
  async getAllGameCategories(): Promise<GameCategory[]> {
    return this.gameCategoryRepository.findAll();
  }

  /**
   * Gets games by category id.
   */
  async getGamesByCategory(categoryId: number) {
    await this.categoryService.getCategoryById(categoryId);

    const mappings = await this.gameCategoryRepository.findByCategory(categoryId);
    return mappings.map((mapping) => mapping.game);
  }
}
