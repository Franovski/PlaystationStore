/**
 * @file gameRepository.ts
 * @purpose Manages direct database access operations for the Game entity.
 * @overview This repository class abstracts TypeORM methods, providing clean and reusable data access functions to the service layer.
 * @responsibilities Executes CRUD operations against the database for the 'games' table.
 * @interaction Called exclusively by GameService to perform database transactions, completely decoupling data persistence from business logic.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './gameEntity';
import { CreateGameDto, UpdateGameDto } from './gameDto';

/**
 * Data access class for the Game entity.
 * 
 * @class GameRepository
 * @description Wraps the underlying TypeORM generic Repository to offer domain-specific query methods for games.
 */
@Injectable()
export class GameRepository {
  /**
   * Initializes the GameRepository with the injected TypeORM Repository.
   * 
   * @param {Repository<Game>} repository - The generic TypeORM repository for the Game entity.
   */
  constructor(
    @InjectRepository(Game)
    private readonly repository: Repository<Game>,
  ) {}

  /**
   * Retrieves all game records from the database.
   * 
   * @returns {Promise<Game[]>} A promise resolving to an array of all game entities.
   */
  async findAll(): Promise<Game[]> {
    return this.repository.find();
  }

  /**
   * Finds a specific game by its primary key ID.
   * 
   * @param {number} gameId - The unique identifier of the game.
   * @returns {Promise<Game | null>} A promise resolving to the found game entity, or null if it doesn't exist.
   */
  async findById(gameId: number): Promise<Game | null> {
    return this.repository.findOne({ where: { gameId } });
  }

  /**
   * Retrieves a list of games matching a specific title exactly.
   * 
   * @param {string} title - The exact title string to query for.
   * @returns {Promise<Game[]>} A promise resolving to an array of matching games.
   */
  async findByTitle(title: string): Promise<Game[]> {
    return this.repository.find({ where: { title } });
  }

  /**
   * Creates and persists a new game record in the database.
   * 
   * @param {CreateGameDto} createDto - The validated data transfer object for creating the game.
   * @returns {Promise<Game>} A promise resolving to the fully persisted game entity containing its new database ID.
   */
  async create(createDto: CreateGameDto): Promise<Game> {
    // Instantiates a new Entity object locally before committing to the database.
    const game = this.repository.create(createDto);
    return this.repository.save(game);
  }

  /**
   * Updates an existing game record partially.
   * 
   * @param {number} gameId - The ID of the target game.
   * @param {UpdateGameDto} updateData - An object comprising the columns strictly intended for updating.
   * @returns {Promise<Game | null>} A promise resolving to the freshly updated game entity, or null if the initial lookup failed afterward.
   */
  async update(gameId: number, updateData: UpdateGameDto): Promise<Game | null> {
    // Apply partial updates directly in an SQL UPDATE query for efficiency.
    await this.repository.update(gameId, updateData);
    
    // Retrieve and return the updated entity state.
    return this.findById(gameId);
  }

  /**
   * Completely removes a game record from the database.
   * 
   * @param {number} gameId - The ID of the targeted game.
   * @returns {Promise<void>} A promise resolving once the deletion transaction is successful.
   */
  async remove(gameId: number): Promise<void> {
    await this.repository.delete(gameId);
  }
}