/**
 * @file wishlistRepository.ts
 * @purpose Provides database access for wishlist records.
 * @overview Wraps TypeORM queries for user/game wishlist pairs.
 * @responsibilities Finds, creates, and removes wishlist rows.
 * @interaction Used by WishlistService and dashboard aggregation.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './wishlistEntity';

/**
 * Repository wrapper for wishlist entries.
 *
 * @class WishlistRepository
 */
@Injectable()
export class WishlistRepository {
  constructor(
    @InjectRepository(Wishlist)
    private readonly repository: Repository<Wishlist>,
  ) {}

  /**
   * Finds all wishlist entries for a user.
   */
  async findByUserId(userId: string): Promise<Wishlist[]> {
    return this.repository.find({
      where: { userId },
      relations: ['game'],
      order: { addedAt: 'DESC' },
    });
  }

  /**
   * Finds all wishlist rows with owner and game details for admin views.
   */
  async findAll(): Promise<Wishlist[]> {
    return this.repository.find({
      relations: ['user', 'game'],
      order: { addedAt: 'DESC' },
    });
  }

  /**
   * Finds one user/game wishlist entry.
   */
  async findByUserAndGame(userId: string, gameId: number): Promise<Wishlist | null> {
    return this.repository.findOne({ where: { userId, gameId }, relations: ['game'] });
  }

  /**
   * Creates a wishlist entry.
   */
  async create(userId: string, gameId: number): Promise<Wishlist> {
    const entry = this.repository.create({ userId, gameId });
    return this.repository.save(entry);
  }

  /**
   * Removes a wishlist entry.
   */
  async remove(userId: string, gameId: number): Promise<void> {
    await this.repository.delete({ userId, gameId });
  }
}
