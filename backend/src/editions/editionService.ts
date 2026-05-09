/**
 * @file editionService.ts
 * @purpose Contains business logic for edition lifecycle and validation.
 * @overview Ensures edition data is valid, unique within a game, and connected to an existing game.
 * @responsibilities Validates names, prices, identifiers, duplicate edition names, and mutation safety.
 * @interaction Called by EditionResolver, order validation, library ownership checks, and storefront queries.
 */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Edition } from './editionEntity';
import { CreateEditionDto, UpdateEditionDto } from './editionDto';
import { EditionRepository } from './editionRepository';
import { GameService } from '../games/gameService';

/**
 * Service class for edition behavior.
 *
 * @class EditionService
 */
@Injectable()
export class EditionService {
  constructor(
    private readonly repository: EditionRepository,
    private readonly gameService: GameService,
  ) {}

  /**
   * Retrieves every edition.
   */
  async getAllEditions(): Promise<Edition[]> {
    return this.repository.findAll();
  }

  /**
   * Retrieves an edition by ID.
   */
  async getEditionById(id: number): Promise<Edition> {
    this.validateId(id, 'Edition ID');

    const edition = await this.repository.findById(id);
    if (!edition) {
      throw new NotFoundException(`Edition with ID ${id} not found`);
    }

    return edition;
  }

  /**
   * Retrieves all editions for a game.
   */
  async getEditionsByGameId(gameId: number): Promise<Edition[]> {
    this.validateId(gameId, 'Game ID');
    await this.gameService.getGameById(gameId);
    return this.repository.findByGameId(gameId);
  }

  /**
   * Creates a new edition after validation.
   */
  async createEdition(dto: CreateEditionDto): Promise<Edition> {
    const sanitized: CreateEditionDto = {
      ...dto,
      name: this.normalizeName(dto.name),
      includes: this.normalizeOptionalText(dto.includes),
    };

    this.validatePrice(sanitized.price);
    this.validateId(sanitized.gameId, 'Game ID');
    await this.gameService.getGameById(sanitized.gameId);
    await this.ensureUniqueNameForGame(sanitized.name, sanitized.gameId);

    return this.repository.create(sanitized);
  }

  /**
   * Updates an edition safely.
   */
  async updateEdition(id: number, dto: UpdateEditionDto): Promise<Edition> {
    this.validateId(id, 'Edition ID');
    const existing = await this.getEditionById(id);

    if (Object.keys(dto).length === 0) {
      return existing;
    }

    const sanitized: UpdateEditionDto = { ...dto };
    if (sanitized.name !== undefined) {
      sanitized.name = this.normalizeName(sanitized.name);
    }
    if (sanitized.includes !== undefined) {
      sanitized.includes = this.normalizeOptionalText(sanitized.includes);
    }
    if (sanitized.price !== undefined) {
      this.validatePrice(sanitized.price);
    }
    if (sanitized.gameId !== undefined) {
      this.validateId(sanitized.gameId, 'Game ID');
      await this.gameService.getGameById(sanitized.gameId);
    }

    const finalName = sanitized.name ?? existing.name;
    const finalGameId = sanitized.gameId ?? existing.gameId;
    await this.ensureUniqueNameForGame(finalName, finalGameId, id);

    const edition = await this.repository.update(id, sanitized);
    if (!edition) {
      throw new NotFoundException(`Edition with ID ${id} not found after update attempt`);
    }

    return edition;
  }

  /**
   * Deletes an edition.
   */
  async deleteEdition(id: number): Promise<void> {
    this.validateId(id, 'Edition ID');
    await this.getEditionById(id);
    await this.repository.remove(id);
  }

  private validateId(id: number, fieldName: string): void {
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException(`${fieldName} must be a positive integer`);
    }
  }

  private normalizeName(name: string): string {
    if (typeof name !== 'string') {
      throw new BadRequestException('Edition name must be a string');
    }

    const normalized = name.trim();
    if (!normalized) {
      throw new BadRequestException('Edition name cannot be empty');
    }

    return normalized;
  }

  private normalizeOptionalText(value?: string): string | undefined {
    return value === undefined ? undefined : value.trim();
  }

  private validatePrice(price: number): void {
    if (typeof price !== 'number' || Number.isNaN(price) || !Number.isFinite(price)) {
      throw new BadRequestException('Edition price must be a valid number');
    }

    if (price < 0) {
      throw new BadRequestException('Edition price cannot be negative');
    }
  }

  private async ensureUniqueNameForGame(name: string, gameId: number, excludedEditionId?: number): Promise<void> {
    const existing = await this.repository.findByName(name);
    const duplicate = existing.find((edition) => {
      const sameGame = edition.gameId === gameId;
      const differentEdition = excludedEditionId === undefined || edition.editionId !== excludedEditionId;
      return sameGame && differentEdition;
    });

    if (duplicate) {
      throw new BadRequestException(`Edition '${name}' already exists for game with ID ${gameId}`);
    }
  }
}
