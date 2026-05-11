/**
 * @file dlcService.ts
 * @purpose Contains the core business logic and validations for downloadable content objects.
 * @overview This service manages DLC lifecycle events like creation, updating, retrieval, deletion, and domain-level validation before persistence.
 * @responsibilities Implements business rules for DLCs, including ID validation, name normalization, price validation, release-date validation, game ownership checks, duplicate prevention, and safe mutation handling.
 * @interaction Receives calls from DLCResolver, performs validations, and invokes DLCRepository for data persistence/retrieval. Raises exceptions if business rules are violated.
 */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DLCRepository } from './dlcRepository';
import { DLC } from './dlcEntity';
import { CreateDLCDto, UpdateDLCDto } from './dlcDto';
import { GameService } from '../games/gameService';
import { emitGameChanged } from '../socket';

/**
 * Service orchestrating functionality for downloadable content management.
 *
 * @class DLCService
 * @description Encapsulates business logic, data rules, and validation for retrieving or mutating DLC entities.
 * Prevents invalid states, such as negative prices, empty names, invalid IDs, duplicate DLC names for the same game,
 * and invalid release dates.
 */
@Injectable()
export class DLCService {
  /**
   * Initializes the DLCService.
   *
   * @param {DLCRepository} repository - Repository providing data access specifically for DLC entities.
   */
  constructor(
    private readonly repository: DLCRepository,
    private readonly gameService: GameService,
  ) {}

  /**
   * Retrieves all DLC records stored in the system.
   *
   * @returns {Promise<DLC[]>} A promise resolving to an array containing every available DLC entity.
   */
  async getAllDLCs(): Promise<DLC[]> {
    return this.repository.findAll();
  }

  /**
   * Retrieves all DLC records with their related Game entity.
   *
   * @returns {Promise<DLC[]>} A promise resolving to an array of DLC entities including their associated games.
   */
  async getAllDLCsWithGames(): Promise<DLC[]> {
    return this.repository.findAllWithGames();
  }

  /**
   * Fetches a DLC record based on its strict numeric ID.
   *
   * @param {number} id - The ID of the desired DLC.
   * @throws {BadRequestException} If the supplied ID is not a valid positive integer.
   * @throws {NotFoundException} If no associated DLC can be found with the given ID.
   * @returns {Promise<DLC>} A promise resolving to the matched DLC object.
   */
  async getDLCById(id: number): Promise<DLC> {
    this.validateId(id, 'DLC ID');

    const dlc = await this.repository.findById(id);
    if (!dlc) {
      throw new NotFoundException(`DLC with ID ${id} not found`);
    }

    return dlc;
  }

  /**
   * Fetches a DLC record by ID and includes its related Game entity.
   *
   * @param {number} id - The ID of the desired DLC.
   * @throws {BadRequestException} If the supplied ID is not a valid positive integer.
   * @throws {NotFoundException} If no associated DLC can be found with the given ID.
   * @returns {Promise<DLC>} A promise resolving to the matched DLC object with game details.
   */
  async getDLCByIdWithGame(id: number): Promise<DLC> {
    this.validateId(id, 'DLC ID');

    const dlc = await this.repository.findByIdWithGame(id);
    if (!dlc) {
      throw new NotFoundException(`DLC with ID ${id} not found`);
    }

    return dlc;
  }

  /**
   * Performs an exact-name search for DLC records.
   *
   * @param {string} name - The DLC name to query against.
   * @throws {BadRequestException} If the supplied name is empty or invalid.
   * @throws {NotFoundException} If the search yields no results.
   * @returns {Promise<DLC[]>} A promise resolving to a collection of matched DLC records.
   */
  async getDLCsByName(name: string): Promise<DLC[]> {
    const normalizedName = this.normalizeName(name);

    const dlcs = await this.repository.findByName(normalizedName);
    if (!dlcs || dlcs.length === 0) {
      throw new NotFoundException(
        `No DLC found with this name: ${normalizedName}`,
      );
    }

    return dlcs;
  }

  /**
   * Retrieves all DLC records that belong to a specific game.
   *
   * @param {number} gameId - The ID of the game whose DLC records should be retrieved.
   * @throws {BadRequestException} If the supplied game ID is not a valid positive integer.
   * @throws {NotFoundException} If the game has no DLC records.
   * @returns {Promise<DLC[]>} A promise resolving to all DLC records attached to the given game.
   */
  async getDLCsByGameId(gameId: number): Promise<DLC[]> {
    this.validateId(gameId, 'Game ID');
    await this.gameService.getGameById(gameId);

    const dlcs = await this.repository.findByGameId(gameId);
    if (!dlcs || dlcs.length === 0) {
      throw new NotFoundException(`No DLC found for game with ID ${gameId}`);
    }

    return dlcs;
  }

  /**
   * Retrieves all DLC records for a game without treating an empty collection as an error.
   *
   * @param {number} gameId - The game whose DLC records should be returned.
   * @returns {Promise<DLC[]>} A promise resolving to matching DLC records, or an empty array.
   */
  async listDLCsByGameId(gameId: number): Promise<DLC[]> {
    this.validateId(gameId, 'Game ID');
    await this.gameService.getGameById(gameId);
    return this.repository.findByGameId(gameId);
  }

  /**
   * Validates input criteria and creates a new DLC in the database.
   *
   * @param {CreateDLCDto} createDTO - The DTO containing properties for the desired DLC.
   * @throws {BadRequestException} If structural or business preconditions are not met.
   * @returns {Promise<DLC>} A promise resolving to the created DLC resource.
   */
  async createDLC(createDTO: CreateDLCDto): Promise<DLC> {
    const sanitizedDTO: CreateDLCDto = {
      ...createDTO,
      name: this.normalizeName(createDTO.name),
    };

    this.validatePrice(sanitizedDTO.price);
    this.validateId(sanitizedDTO.gameId, 'Game ID');
    await this.gameService.getGameById(sanitizedDTO.gameId);
    this.validateReleaseDate(sanitizedDTO.releaseDate);

    await this.ensureUniqueDLCNameForGame(
      sanitizedDTO.name,
      sanitizedDTO.gameId,
    );

    const dlc = await this.repository.create(sanitizedDTO);
    await this.emitParentGameUpdated(dlc.gameId);
    return dlc;
  }

  /**
   * Modifies an existing DLC by applying partial updates after validating constraints.
   *
   * @param {number} id - The ID mapped to the DLC entity pending modification.
   * @param {UpdateDLCDto} updateDTO - A partial subset of DLC properties to update.
   * @throws {BadRequestException} If the supplied ID or updated fields violate domain requirements.
   * @throws {NotFoundException} If the ID maps to a non-existent record.
   * @returns {Promise<DLC>} A promise resolving to the mutated DLC entity.
   */
  async updateDLC(id: number, updateDTO: UpdateDLCDto): Promise<DLC> {
    this.validateId(id, 'DLC ID');

    const existingDLC = await this.getDLCById(id);

    if (Object.keys(updateDTO).length === 0) {
      return existingDLC;
    }

    const sanitizedDTO: UpdateDLCDto = { ...updateDTO };

    if (sanitizedDTO.name !== undefined) {
      sanitizedDTO.name = this.normalizeName(sanitizedDTO.name);
    }

    if (sanitizedDTO.price !== undefined) {
      this.validatePrice(sanitizedDTO.price);
    }

    if (sanitizedDTO.gameId !== undefined) {
      this.validateId(sanitizedDTO.gameId, 'Game ID');
      await this.gameService.getGameById(sanitizedDTO.gameId);
    }

    if (sanitizedDTO.releaseDate !== undefined) {
      this.validateReleaseDate(sanitizedDTO.releaseDate);
    }

    const finalName = sanitizedDTO.name ?? existingDLC.name;
    const finalGameId = sanitizedDTO.gameId ?? existingDLC.gameId;

    await this.ensureUniqueDLCNameForGame(finalName, finalGameId, id);

    const dlc = await this.repository.update(id, sanitizedDTO);
    if (!dlc) {
      throw new NotFoundException(
        `DLC with ID ${id} not found after update attempt`,
      );
    }

    await this.emitParentGameUpdated(existingDLC.gameId);
    if (dlc.gameId !== existingDLC.gameId) {
      await this.emitParentGameUpdated(dlc.gameId);
    }

    return dlc;
  }

  /**
   * Completely removes a specified DLC from persistence.
   *
   * @param {number} id - The unique ID of the DLC targeted for deletion.
   * @throws {BadRequestException} If the supplied ID is not a valid positive integer.
   * @throws {NotFoundException} If the entity does not exist.
   * @returns {Promise<void>} Resolves when the resource is completely removed.
   */
  async deleteDLC(id: number): Promise<void> {
    this.validateId(id, 'DLC ID');

    const dlc = await this.repository.findById(id);
    if (!dlc) {
      throw new NotFoundException(`DLC with ID ${id} not found`);
    }

    await this.repository.remove(id);
    await this.emitParentGameUpdated(dlc.gameId);
  }

  private async emitParentGameUpdated(gameId: number): Promise<void> {
    const game = await this.gameService.getGameById(gameId);
    emitGameChanged('updated', game);
  }

  /**
   * Validates that a given identifier is a positive integer.
   *
   * @param {number} id - The numeric identifier to validate.
   * @param {string} fieldName - Human-readable field name used in exception messages.
   * @throws {BadRequestException} If the ID is missing, non-integer, or less than 1.
   * @returns {void}
   */
  private validateId(id: number, fieldName: string): void {
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException(`${fieldName} must be a positive integer`);
    }
  }

  /**
   * Normalizes and validates a DLC name.
   *
   * @param {string} name - The DLC name to normalize.
   * @throws {BadRequestException} If the name is not a valid non-empty string.
   * @returns {string} The trimmed DLC name.
   */
  private normalizeName(name: string): string {
    if (typeof name !== 'string') {
      throw new BadRequestException('DLC name must be a string');
    }

    const normalizedName = name.trim();

    if (normalizedName.length === 0) {
      throw new BadRequestException('DLC name cannot be empty');
    }

    if (normalizedName.length > 255) {
      throw new BadRequestException('DLC name cannot exceed 255 characters');
    }

    return normalizedName;
  }

  /**
   * Validates that a DLC price is structurally and logically valid.
   *
   * @param {number} price - The price value to validate.
   * @throws {BadRequestException} If the price is not a finite number, is negative, or exceeds supported precision.
   * @returns {void}
   */
  private validatePrice(price: number): void {
    if (
      typeof price !== 'number' ||
      Number.isNaN(price) ||
      !Number.isFinite(price)
    ) {
      throw new BadRequestException('DLC price must be a valid number');
    }

    if (price < 0) {
      throw new BadRequestException('DLC price cannot be negative');
    }

    if (price > 99999999.99) {
      throw new BadRequestException(
        'DLC price exceeds the maximum supported value',
      );
    }

    const decimalPlaces = price.toString().split('.')[1]?.length ?? 0;
    if (decimalPlaces > 2) {
      throw new BadRequestException(
        'DLC price cannot have more than 2 decimal places',
      );
    }
  }

  /**
   * Validates DLC release-date rules.
   *
   * @param {string | undefined} releaseDateValue - Optional ISO date string supplied by the client.
   * @throws {BadRequestException} If the date is invalid or violates release-date policy.
   * @returns {void}
   */
  private validateReleaseDate(releaseDateValue?: string): void {
    if (!releaseDateValue) {
      return;
    }

    const releaseDate = new Date(releaseDateValue);

    if (Number.isNaN(releaseDate.getTime())) {
      throw new BadRequestException('DLC release date must be a valid date');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const normalizedReleaseDate = new Date(releaseDate);
    normalizedReleaseDate.setHours(0, 0, 0, 0);

    if (normalizedReleaseDate < today) {
      throw new BadRequestException('DLC release date cannot be in the past');
    }
  }

  /**
   * Ensures that a DLC name is unique within the same game.
   *
   * @param {string} name - The normalized DLC name to check.
   * @param {number} gameId - The game ID that owns the DLC.
   * @param {number} excludedDLCId - Optional DLC ID to exclude during update checks.
   * @throws {BadRequestException} If another DLC with the same name already exists for the same game.
   * @returns {Promise<void>} Resolves when the uniqueness rule passes.
   */
  private async ensureUniqueDLCNameForGame(
    name: string,
    gameId: number,
    excludedDLCId?: number,
  ): Promise<void> {
    const existingDLCs = await this.repository.findByName(name);

    const duplicate = existingDLCs.find((dlc) => {
      const isSameGame = dlc.gameId === gameId;
      const isDifferentDLC =
        excludedDLCId === undefined || dlc.dlcId !== excludedDLCId;

      return isSameGame && isDifferentDLC;
    });

    if (duplicate) {
      throw new BadRequestException(
        `DLC '${name}' already exists for game with ID ${gameId}`,
      );
    }
  }
}
