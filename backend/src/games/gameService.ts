/**
 * @file gameService.ts
 * @purpose Contains the core business logic and validations for game objects.
 * @overview This service manages game lifecycle events like creation, updating, retrieval, and structural validations before saving.
 * @responsibilities Implements business rules for games (e.g., preventing negative prices, validating future release dates) and mediates between controllers and repositories.
 * @interaction Receives calls from GameController, performs validations, and invokes GameRepository for data persistence/retrieval. Raises exceptions if rules are violated.
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { GameRepository } from './gameRepository';
import { CreateGameDto, UpdateGameDto } from './gameDto';
import { Game } from './gameEntity';

/**
 * Service orchestrating functionality for games management.
 * 
 * @class GameService
 * @description Encapsulates business logic, data rules, and verification for retrieving or mutating Game entities. 
 * Prevents invalid states, such as negative prices or empty titles.
 */
@Injectable()
export class GameService {
  /**
   * Initializes the GameService.
   * 
   * @param {GameRepository} gameRepository - Repository providing data access specifically for Game entities.
   */
  constructor(private readonly gameRepository: GameRepository) {}

  /**
   * Retrieves all games stored in the system without pagination or filtering.
   * 
   * @returns {Promise<Game[]>} A promise resolving to an array containing every available game entity.
   */
  async getAllGames(): Promise<Game[]> {
    return this.gameRepository.findAll();
  }

  /**
   * Fetches a game based on its strict numeric ID.
   * 
   * @param {number} id - The ID of the desired game.
   * @throws {NotFoundException} If no associated game can be found with the given ID.
   * @returns {Promise<Game>} A promise resolving to the matched Game object.
   */
  async getGameById(id: number): Promise<Game> {
    const game = await this.gameRepository.findById(id);
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    return game;
  }

  /**
   * Performs an exact or partial match search for games based on their title.
   * 
   * @param {string} title - The title or partial title to query against.
   * @throws {NotFoundException} If the search yields no results.
   * @returns {Promise<Game[]>} A promise resolving to a collection of matched games.
   */
  async getGamesByTitle(title: string): Promise<Game[]> {
    const games = await this.gameRepository.findByTitle(title);
    if (!games || games.length === 0) {
      throw new NotFoundException(`No games found with title '${title}'`);
    }
    return games;
  }

  /**
   * Validates input criteria and provisions a new game in the database.
   * 
   * @param {CreateGameDto} createDto - The dto enveloping properties for the desired game.
   * @throws {BadRequestException} If structural preconditions (e.g., positive price, non-empty title, future date) are not met.
   * @returns {Promise<Game>} A promise resolving to the created Game resource.
   */
  async createGame(createDto: CreateGameDto): Promise<Game> {
    // Validate that the system does not allow free or standard games to have negative pricing
    if (createDto.basePrice < 0) {
      throw new BadRequestException('Game basePrice cannot be negative');
    }

    // Ensure the title isn't secretly omitted via whitespace
    if (createDto.title.trim().length === 0) {
      throw new BadRequestException('Game title cannot be empty');
    }

    // Verify date constraints if a release date is supplied
    if (createDto.releaseDate) {
      const releaseDate = new Date(createDto.releaseDate);
      if (releaseDate <= new Date()) {
        throw new BadRequestException('Game release date must be in the future');
      }
    }

    return this.gameRepository.create(createDto);
  }

  /**
   * Modifies an existing game by applying partial updates, validating constraints beforehand.
   * 
   * @param {number} id - The ID mapped to the game entity pending modifications.
   * @param {UpdateGameDto} updateDto - A partial subset of game properties to update.
   * @throws {NotFoundException} If the ID maps to a non-existent record.
   * @throws {BadRequestException} If any updated properties violate domain requirements.
   * @returns {Promise<Game>} A promise resolving to the mutated Game.
   */
  async updateGame(id: number, updateDto: UpdateGameDto): Promise<Game> {
    // Pre-verify existence to halt operation on an invalid ID early
    await this.getGameById(id);

    // Re-run logical validation checks to prevent modifying into an invalid state
    if (updateDto.basePrice !== undefined && updateDto.basePrice < 0) {
        throw new BadRequestException('Game basePrice cannot be negative');
    }

    if (updateDto.title !== undefined && updateDto.title.trim().length === 0) {
      throw new BadRequestException('Game title cannot be empty');
    }

    if (updateDto.releaseDate) {
      const releaseDate = new Date(updateDto.releaseDate);
      if (releaseDate <= new Date()) {
        throw new BadRequestException('Game release date must be in the future');
      }
    }

    // Prevent redundant database hits by aborting when the request body contains zero modifiable fields
    if (Object.keys(updateDto).length === 0) {
      return this.getGameById(id);
    }

    const game = await this.gameRepository.update(id, updateDto);
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found after update attempt`);
    }
    return game;
  }

  /**
   * Erases a specified game from persistence.
   * 
   * @param {number} id - The unique ID of the game targeted for deletion.
   * @throws {NotFoundException} If the entity doesn't exist.
   * @returns {Promise<void>} Resolves when the resource is completely removed.
   */
  async deleteGame(id: number): Promise<void> {
    // Ensure the target game exists before attempting the deletion.
    const game = await this.gameRepository.findById(id);
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    await this.gameRepository.remove(id);
  }
}