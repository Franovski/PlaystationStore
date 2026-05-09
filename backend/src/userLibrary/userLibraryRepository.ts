/**
 * @file userLibraryRepository.ts
 * @purpose Provides direct persistence access for user library records.
 * @overview Wraps TypeORM queries for polymorphic ownership rows.
 * @responsibilities Finds, creates, and removes library entries.
 * @interaction Used by UserLibraryService, OrdersService, and review eligibility checks.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLibrary } from './userLibraryEntity';

/**
 * Repository wrapper for library ownership.
 *
 * @class UserLibraryRepository
 */
@Injectable()
export class UserLibraryRepository {
  constructor(
    @InjectRepository(UserLibrary)
    private readonly repository: Repository<UserLibrary>,
  ) {}

  /**
   * Finds all library records for one user.
   */
  async findByUserId(userId: string): Promise<UserLibrary[]> {
    return this.repository.find({ where: { userId }, order: { purchaseDate: 'DESC' } });
  }

  /**
   * Finds all ownership rows with owners for admin management.
   */
  async findAll(): Promise<UserLibrary[]> {
    return this.repository.find({
      relations: ['user'],
      order: { purchaseDate: 'DESC' },
    });
  }

  /**
   * Finds one ownership row.
   */
  async findByUserAndItem(userId: string, itemType: string, itemId: number): Promise<UserLibrary | null> {
    return this.repository.findOne({ where: { userId, itemType, itemId } });
  }

  /**
   * Creates a new ownership row.
   */
  async create(userId: string, itemType: string, itemId: number): Promise<UserLibrary> {
    const entry = this.repository.create({ userId, itemType, itemId });
    return this.repository.save(entry);
  }

  /**
   * Removes an ownership row.
   */
  async remove(userId: string, itemType: string, itemId: number): Promise<void> {
    await this.repository.delete({ userId, itemType, itemId });
  }
}
