/**
 * @file wishlistService.ts
 * @purpose Contains wishlist business logic for current-user actions.
 * @overview Validates target games, prevents duplicate wishlist rows, and scopes access to the authenticated user.
 * @responsibilities Handles adding, listing, and removing wishlist entries.
 * @interaction Used by WishlistResolver and current dashboard aggregation.
 */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Wishlist } from './wishlistEntity';
import { WishlistRepository } from './wishlistRepository';
import { GameService } from '../games/gameService';

/**
 * Service class for wishlist behavior.
 *
 * @class WishlistService
 */
@Injectable()
export class WishlistService {
  constructor(
    private readonly repository: WishlistRepository,
    private readonly gameService: GameService,
  ) {}

  /**
   * Lists the signed-in user's wishlist.
   */
  async getWishlistForUser(userId: string): Promise<Wishlist[]> {
    return this.repository.findByUserId(userId);
  }

  /**
   * Lists every wishlist item for admin views.
   */
  async getAllWishlistItems(): Promise<Wishlist[]> {
    return this.repository.findAll();
  }

  /**
   * Adds a game to a user's wishlist.
   */
  async addWishlistItem(userId: string, gameId: number): Promise<Wishlist> {
    this.validateId(gameId, 'Game ID');
    await this.gameService.getGameById(gameId);

    const existing = await this.repository.findByUserAndGame(userId, gameId);
    if (existing) {
      throw new BadRequestException('This game is already in your wishlist');
    }

    return this.repository.create(userId, gameId);
  }

  /**
   * Removes a game from a user's wishlist.
   */
  async removeWishlistItem(userId: string, gameId: number): Promise<void> {
    this.validateId(gameId, 'Game ID');
    const existing = await this.repository.findByUserAndGame(userId, gameId);

    if (!existing) {
      throw new NotFoundException('Wishlist item not found');
    }

    await this.repository.remove(userId, gameId);
  }

  private validateId(id: number, fieldName: string): void {
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException(`${fieldName} must be a positive integer`);
    }
  }
}
