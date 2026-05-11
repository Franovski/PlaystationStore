import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { GameCategoryRepository } from './gameCategoryRepository';
import { GameService } from '../games/gameService';
import { CategoryService } from '../categories/categoryService';
import { AddGameCategoryDto } from './gameCategoryDto';
import { GameCategory } from './gameCategoryEntity';
import { emitGameChanged } from '../socket';

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
    const game = await this.gameService.getGameById(dto.gameId);
    await this.categoryService.getCategoryById(dto.categoryId);

    const existing = await this.gameCategoryRepository.checkLink(
      dto.gameId,
      dto.categoryId,
    );
    if (existing) {
      throw new ConflictException(
        `Game ID ${dto.gameId} is already linked with Category ID ${dto.categoryId}`,
      );
    }

    const link = await this.gameCategoryRepository.link(
      dto.gameId,
      dto.categoryId,
    );
    emitGameChanged('updated', game);
    return link;
  }

  /**
   * Unlinks a game and a category.
   */
  async unlinkGameAndCategory(
    gameId: number,
    categoryId: number,
  ): Promise<void> {
    const existing = await this.gameCategoryRepository.checkLink(
      gameId,
      categoryId,
    );
    if (!existing) {
      throw new NotFoundException(
        `Link between Game ID ${gameId} and Category ID ${categoryId} not found`,
      );
    }
    await this.gameCategoryRepository.unlink(gameId, categoryId);
    const game = await this.gameService.getGameById(gameId);
    emitGameChanged('updated', game);
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

    const mappings =
      await this.gameCategoryRepository.findByCategory(categoryId);
    return mappings.map((mapping) => mapping.game);
  }
}
