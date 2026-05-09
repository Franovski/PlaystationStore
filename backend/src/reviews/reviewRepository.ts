/**
 * @file reviewRepository.ts
 * @purpose Provides direct persistence operations for game reviews.
 * @overview Wraps TypeORM review queries for service-level business logic.
 * @responsibilities Finds, creates, updates, and removes review records.
 * @interaction Used by ReviewService and storefront game detail aggregation.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './reviewEntity';
import { CreateReviewDto, UpdateReviewDto } from './reviewDto';

/**
 * Repository wrapper for reviews.
 *
 * @class ReviewRepository
 */
@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(Review)
    private readonly repository: Repository<Review>,
  ) {}

  /**
   * Finds reviews for a game with author information.
   */
  async findByGameId(gameId: number): Promise<Review[]> {
    return this.repository.find({
      where: { gameId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Finds every review with author and game details for admin views.
   */
  async findAll(): Promise<Review[]> {
    return this.repository.find({
      relations: ['user', 'game'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Finds a review by ID.
   */
  async findById(reviewId: number): Promise<Review | null> {
    return this.repository.findOne({ where: { reviewId }, relations: ['user', 'game'] });
  }

  /**
   * Finds a user's review for one game.
   */
  async findByUserAndGame(userId: string, gameId: number): Promise<Review | null> {
    return this.repository.findOne({ where: { userId, gameId } });
  }

  /**
   * Creates a review.
   */
  async create(userId: string, dto: CreateReviewDto): Promise<Review> {
    const review = this.repository.create({
      userId,
      gameId: dto.gameId,
      rating: dto.rating,
      comment: dto.comment ?? null,
    });
    return this.repository.save(review);
  }

  /**
   * Updates a review.
   */
  async update(reviewId: number, dto: UpdateReviewDto): Promise<Review | null> {
    await this.repository.update(reviewId, dto);
    return this.findById(reviewId);
  }

  /**
   * Deletes a review.
   */
  async remove(reviewId: number): Promise<void> {
    await this.repository.delete(reviewId);
  }
}
