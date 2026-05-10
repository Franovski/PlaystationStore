/**
 * @file userLibraryService.ts
 * @purpose Contains user library ownership rules.
 * @overview Validates item types and item IDs, prevents duplicate ownership, and supports review eligibility checks.
 * @responsibilities Grants ownership after purchases and reads a customer's owned items.
 * @interaction Used by UserLibraryResolver, OrdersService, ReviewsService, and dashboard aggregation.
 */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserLibrary } from './userLibraryEntity';
import { UserLibraryRepository } from './userLibraryRepository';
import { GameService } from '../games/gameService';
import { DLCService } from '../dlc/dlcService';
import { EditionService } from '../editions/editionService';

/**
 * Service class for library ownership.
 *
 * @class UserLibraryService
 */
@Injectable()
export class UserLibraryService {
  private readonly supportedItemTypes = ['game', 'dlc', 'edition'];

  constructor(
    private readonly repository: UserLibraryRepository,
    private readonly gameService: GameService,
    private readonly dlcService: DLCService,
    private readonly editionService: EditionService,
  ) {}

  /**
   * Lists all owned items for a user.
   */
  async getLibraryForUser(userId: string): Promise<UserLibrary[]> {
    return this.hydrateLibraryItems(await this.repository.findByUserId(userId));
  }

  /**
   * Lists every ownership row for admin views.
   */
  async getAllLibraryItems(): Promise<UserLibrary[]> {
    return this.hydrateLibraryItems(await this.repository.findAll());
  }

  /**
   * Validates and grants ownership of one item.
   */
  async grantOwnership(
    userId: string,
    itemType: string,
    itemId: number,
  ): Promise<UserLibrary> {
    const normalizedType = this.normalizeItemType(itemType);
    this.validateId(itemId, 'Item ID');
    await this.validatePurchasableItem(normalizedType, itemId);

    const existing = await this.repository.findByUserAndItem(
      userId,
      normalizedType,
      itemId,
    );
    if (existing) {
      throw new BadRequestException('User already owns this item');
    }

    return this.hydrateLibraryItem(
      await this.repository.create(userId, normalizedType, itemId),
    );
  }

  /**
   * Checks whether a user owns a specific item.
   */
  async hasOwnership(
    userId: string,
    itemType: string,
    itemId: number,
  ): Promise<boolean> {
    const normalizedType = this.normalizeItemType(itemType);
    const existing = await this.repository.findByUserAndItem(
      userId,
      normalizedType,
      itemId,
    );
    return Boolean(existing);
  }

  /**
   * Ensures a user owns a specific item.
   */
  async ensureOwnership(
    userId: string,
    itemType: string,
    itemId: number,
  ): Promise<void> {
    const owned = await this.hasOwnership(userId, itemType, itemId);
    if (!owned) {
      throw new NotFoundException('Library item not found for this user');
    }
  }

  /**
   * Checks if a user can review a game based on owned games or editions.
   */
  async userOwnsGame(userId: string, gameId: number): Promise<boolean> {
    this.validateId(gameId, 'Game ID');

    const ownsBaseGame = await this.hasOwnership(userId, 'game', gameId);
    if (ownsBaseGame) {
      return true;
    }

    const editions = await this.editionService.getEditionsByGameId(gameId);
    for (const edition of editions) {
      const ownsEdition = await this.hasOwnership(
        userId,
        'edition',
        edition.editionId,
      );
      if (ownsEdition) {
        return true;
      }
    }

    return false;
  }

  /**
   * Validates that an item type and ID point to a real purchasable record.
   */
  async validatePurchasableItem(
    itemType: string,
    itemId: number,
  ): Promise<void> {
    const normalizedType = this.normalizeItemType(itemType);
    this.validateId(itemId, 'Item ID');

    if (normalizedType === 'game') {
      await this.gameService.getGameById(itemId);
      return;
    }

    if (normalizedType === 'dlc') {
      await this.dlcService.getDLCById(itemId);
      return;
    }

    if (normalizedType === 'edition') {
      await this.editionService.getEditionById(itemId);
    }
  }

  private normalizeItemType(itemType: string): string {
    const normalized = String(itemType || '')
      .trim()
      .toLowerCase();
    if (!this.supportedItemTypes.includes(normalized)) {
      throw new BadRequestException(
        'itemType must be one of: game, dlc, edition',
      );
    }

    return normalized;
  }

  private validateId(id: number, fieldName: string): void {
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException(`${fieldName} must be a positive integer`);
    }
  }

  private async hydrateLibraryItems(
    items: UserLibrary[],
  ): Promise<UserLibrary[]> {
    return Promise.all(items.map((item) => this.hydrateLibraryItem(item)));
  }

  private async hydrateLibraryItem(item: UserLibrary): Promise<UserLibrary> {
    const itemType = String(item.itemType || '').toLowerCase();

    if (itemType === 'game') {
      item.game = await this.getOptionalDisplayItem(() =>
        this.gameService.getGameById(item.itemId),
      );
      return item;
    }

    if (itemType === 'dlc') {
      item.dlc = await this.getOptionalDisplayItem(() =>
        this.dlcService.getDLCByIdWithGame(item.itemId),
      );
      return item;
    }

    if (itemType === 'edition') {
      item.edition = await this.getOptionalDisplayItem(() =>
        this.editionService.getEditionById(item.itemId),
      );
    }

    return item;
  }

  private async getOptionalDisplayItem<T>(
    loader: () => Promise<T>,
  ): Promise<T | null> {
    try {
      return await loader();
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }

      throw error;
    }
  }
}
