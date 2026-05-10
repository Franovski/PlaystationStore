/**
 * @file dlcRepository.ts
 * @purpose Manages direct database access operations for the DLC entity.
 * @overview This repository class abstracts TypeORM methods and provides reusable data access functions for downloadable content records.
 * @responsibilities Executes CRUD operations against the database for the `dlc` table.
 * @interaction Called by DLCService to perform database transactions while keeping persistence logic separated from business logic.
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DLC } from './dlcEntity';
import { CreateDLCDto, UpdateDLCDto } from './dlcDto';

/**
 * Data access class for the DLC entity.
 *
 * @class DLCRepository
 * @description Wraps the TypeORM Repository to provide domain-specific query methods for downloadable content.
 */
@Injectable()
export class DLCRepository {
  /**
   * Initializes the DLCRepository with the injected TypeORM Repository.
   *
   * @param {Repository<DLC>} repository - The generic TypeORM repository for the DLC entity.
   */
  constructor(
    @InjectRepository(DLC)
    private readonly repository: Repository<DLC>,
  ) {}

  /**
   * Retrieves all DLC records from the database.
   *
   * @returns {Promise<DLC[]>} A promise resolving to an array of all DLC entities.
   */
  async findAll(): Promise<DLC[]> {
    return this.repository.find();
  }

  /**
   * Retrieves all DLC records with their related Game entity.
   *
   * @returns {Promise<DLC[]>} A promise resolving to an array of DLC entities including game information.
   */
  async findAllWithGames(): Promise<DLC[]> {
    return this.repository.find({
      relations: ['game'],
    });
  }

  /**
   * Finds a specific DLC by its primary key ID.
   *
   * @param {number} dlcId - The unique identifier of the DLC.
   * @returns {Promise<DLC | null>} A promise resolving to the found DLC entity, or null if it does not exist.
   */
  async findById(dlcId: number): Promise<DLC | null> {
    return this.repository.findOne({
      where: { dlcId },
    });
  }

  /**
   * Finds a specific DLC by its primary key ID and includes the related Game entity.
   *
   * @param {number} dlcId - The unique identifier of the DLC.
   * @returns {Promise<DLC | null>} A promise resolving to the found DLC with its related game, or null if it does not exist.
   */
  async findByIdWithGame(dlcId: number): Promise<DLC | null> {
    return this.repository.findOne({
      where: { dlcId },
      relations: ['game'],
    });
  }

  /**
   * Retrieves a list of DLC records matching a specific name exactly.
   *
   * @param {string} name - The exact DLC name to search for.
   * @returns {Promise<DLC[]>} A promise resolving to an array of matching DLC entities.
   */
  async findByName(name: string): Promise<DLC[]> {
    return this.repository.find({
      where: { name },
    });
  }

  /**
   * Retrieves all DLC records that belong to a specific game.
   *
   * @param {number} gameId - The unique identifier of the related game.
   * @returns {Promise<DLC[]>} A promise resolving to an array of DLC entities connected to the given game.
   */
  async findByGameId(gameId: number): Promise<DLC[]> {
    return this.repository.find({
      where: {
        game: {
          gameId,
        },
      },
      relations: ['game'],
    });
  }

  /**
   * Creates and persists a new DLC record in the database.
   *
   * @param {createDLCDto} createDTO - The validated data transfer object used to create the DLC.
   * @returns {Promise<DLC>} A promise resolving to the newly saved DLC entity.
   */
  async create(createDTO: CreateDLCDto): Promise<DLC> {
    // Instantiates a new DLC entity locally before saving it to the database.
    const dlc = this.repository.create(createDTO);
    return this.repository.save(dlc);
  }

  /**
   * Updates an existing DLC record partially.
   *
   * @param {number} dlcId - The unique identifier of the DLC to update.
   * @param {updateDLCDto} updateDTO - The data transfer object containing the fields to update.
   * @returns {Promise<DLC | null>} A promise resolving to the updated DLC entity, or null if the DLC does not exist.
   */
  async update(dlcId: number, updateDTO: UpdateDLCDto): Promise<DLC | null> {
    // Applies partial updates directly through an SQL UPDATE query.
    await this.repository.update(dlcId, updateDTO);

    // Retrieves and returns the updated DLC entity.
    return this.findById(dlcId);
  }

  /**
   * Completely removes a DLC record from the database.
   *
   * @param {number} dlcId - The unique identifier of the DLC to delete.
   * @returns {Promise<void>} A promise resolving once the deletion operation is complete.
   */
  async remove(dlcId: number): Promise<void> {
    await this.repository.delete(dlcId);
  }
}
