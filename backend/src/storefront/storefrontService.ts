/**
 * @file storefrontService.ts
 * @purpose Aggregates customer-facing game data.
 * @overview Builds game catalog and detail responses from the existing feature services without changing admin CRUD flows.
 * @responsibilities Loads DLCs, editions, platforms, categories, discounts, reviews, and effective game price.
 * @interaction Used by StorefrontResolver and frontend game browsing/detail pages.
 */
import { Injectable } from '@nestjs/common';
import { GameDetails } from './storefrontTypes';
import { GameService } from '../games/gameService';
import { DLCService } from '../dlc/dlcService';
import { EditionService } from '../editions/editionService';
import { DiscountService } from '../discounts/discountService';
import { GameCategoryService } from '../gameCategories/gameCategoryService';
import { GamePlatformService } from '../gamePlatforms/gamePlatformService';
import { ReviewService } from '../reviews/reviewService';
import { Category } from '../categories/categoryEntity';
import { Platform } from '../platforms/platformEntity';

/**
 * Service for store aggregation.
 *
 * @class StorefrontService
 */
@Injectable()
export class StorefrontService {
  constructor(
    private readonly gameService: GameService,
    private readonly dlcService: DLCService,
    private readonly editionService: EditionService,
    private readonly discountService: DiscountService,
    private readonly gameCategoryService: GameCategoryService,
    private readonly gamePlatformService: GamePlatformService,
    private readonly reviewService: ReviewService,
  ) {}

  /**
   * Returns an aggregated catalog entry for every game.
   */
  async getGameCatalog(): Promise<GameDetails[]> {
    const games = await this.gameService.getAllGames();
    return Promise.all(games.map((game) => this.getGameDetails(game.gameId)));
  }

  /**
   * Returns a full detail bundle for one game.
   */
  async getGameDetails(gameId: number): Promise<GameDetails> {
    const game = await this.gameService.getGameById(gameId);
    const [
      dlcs,
      editions,
      categories,
      platforms,
      discounts,
      reviews,
      activeDiscount,
    ] = await Promise.all([
      this.dlcService.listDLCsByGameId(game.gameId),
      this.editionService.getEditionsByGameId(game.gameId),
      this.getCategories(game.gameId),
      this.getPlatforms(game.gameId),
      this.discountService.getDiscountsByGameId(game.gameId),
      this.reviewService.getReviewsForGame(game.gameId),
      this.discountService.getBestActiveDiscountForGame(game.gameId),
    ]);

    const currentPrice =
      await this.discountService.calculateDiscountedGamePrice(
        game.gameId,
        Number(game.basePrice),
      );

    return {
      game,
      currentPrice,
      activeDiscountPercentage: activeDiscount
        ? Number(activeDiscount.percentage)
        : null,
      dlcs,
      editions,
      categories,
      platforms,
      discounts,
      reviews,
    };
  }

  private async getCategories(gameId: number): Promise<Category[]> {
    const categories =
      await this.gameCategoryService.getCategoriesByGame(gameId);
    return categories.filter((category): category is Category =>
      Boolean(category),
    );
  }

  private async getPlatforms(gameId: number): Promise<Platform[]> {
    const platforms = await this.gamePlatformService.getPlatformsByGame(gameId);
    return platforms.filter((platform): platform is Platform =>
      Boolean(platform),
    );
  }
}
