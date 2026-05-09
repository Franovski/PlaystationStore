/**
 * @file editionRepository.ts
 * @purpose Provides direct persistence operations for edition records.
 * @overview Wraps the TypeORM repository with domain-specific edition query helpers.
 * @responsibilities Reads, creates, updates, and deletes rows from the `editions` table.
 * @interaction Used by EditionService to keep database access separate from business rules.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edition } from './editionEntity';
import { CreateEditionDto, UpdateEditionDto } from './editionDto';

/**
 * Repository class for game editions.
 *
 * @class EditionRepository
 */
@Injectable()
export class EditionRepository {
  constructor(
    @InjectRepository(Edition)
    private readonly repository: Repository<Edition>,
  ) {}

  /**
   * Retrieves all editions with their optional parent game relation.
   */
  async findAll(): Promise<Edition[]> {
    return this.repository.find({ relations: ['game'] });
  }

  /**
   * Finds an edition by its identifier.
   */
  async findById(editionId: number): Promise<Edition | null> {
    return this.repository.findOne({ where: { editionId }, relations: ['game'] });
  }

  /**
   * Finds all editions attached to a game.
   */
  async findByGameId(gameId: number): Promise<Edition[]> {
    return this.repository.find({ where: { gameId }, relations: ['game'] });
  }

  /**
   * Finds editions by exact name.
   */
  async findByName(name: string): Promise<Edition[]> {
    return this.repository.find({ where: { name } });
  }

  /**
   * Persists a newly created edition.
   */
  async create(dto: CreateEditionDto): Promise<Edition> {
    const edition = this.repository.create(dto);
    return this.repository.save(edition);
  }

  /**
   * Applies a partial update and returns the refreshed edition.
   */
  async update(editionId: number, dto: UpdateEditionDto): Promise<Edition | null> {
    await this.repository.update(editionId, dto);
    return this.findById(editionId);
  }

  /**
   * Removes an edition from persistence.
   */
  async remove(editionId: number): Promise<void> {
    await this.repository.delete(editionId);
  }
}
