/**
 * @file reviewService.ts
 * @purpose Contains review business rules and ownership validation.
 * @overview Ensures ratings are valid, users own reviewed games, and duplicate reviews are prevented.
 * @responsibilities Handles review reads, creation, updates, and deletion authorization.
 * @interaction Used by ReviewResolver and StorefrontService.
 */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Review } from './reviewEntity';
import { CreateReviewDto, UpdateReviewDto } from './reviewDto';
import { ReviewRepository } from './reviewRepository';
import { GameService } from '../games/gameService';
import { UserLibraryService } from '../userLibrary/userLibraryService';
import { UserRole } from '../users/userEntity';

/**
 * Service class for customer reviews.
 *
 * @class ReviewService
 */
@Injectable()
export class ReviewService {
  constructor(
    private readonly repository: ReviewRepository,
    private readonly gameService: GameService,
    private readonly libraryService: UserLibraryService,
  ) {}

  /**
   * Lists reviews for a game.
   */
  async getReviewsForGame(gameId: number): Promise<Review[]> {
    this.validateId(gameId, 'Game ID');
    await this.gameService.getGameById(gameId);
    return this.repository.findByGameId(gameId);
  }

  /**
   * Lists all reviews for admin moderation.
   */
  async getAllReviews(): Promise<Review[]> {
    return this.repository.findAll();
  }

  /**
   * Creates a review for a game the user owns.
   */
  async createReview(userId: string, dto: CreateReviewDto): Promise<Review> {
    this.validateId(dto.gameId, 'Game ID');
    this.validateRating(dto.rating);
    await this.gameService.getGameById(dto.gameId);

    const ownsGame = await this.libraryService.userOwnsGame(userId, dto.gameId);
    if (!ownsGame) {
      throw new ForbiddenException('You can only review games you own');
    }

    const existing = await this.repository.findByUserAndGame(
      userId,
      dto.gameId,
    );
    if (existing) {
      throw new BadRequestException('You have already reviewed this game');
    }

    return this.repository.create(userId, {
      ...dto,
      comment: this.normalizeOptionalComment(dto.comment),
    });
  }

  /**
   * Updates a review after confirming ownership or admin role.
   */
  async updateReview(
    reviewId: number,
    userId: string,
    role: string | undefined,
    dto: UpdateReviewDto,
  ): Promise<Review> {
    this.validateId(reviewId, 'Review ID');
    const review = await this.getReviewById(reviewId);
    this.ensureCanMutateReview(review, userId, role);

    if (dto.rating !== undefined) {
      this.validateRating(dto.rating);
    }

    const updated = await this.repository.update(reviewId, {
      ...dto,
      comment:
        dto.comment === undefined
          ? undefined
          : this.normalizeOptionalComment(dto.comment),
    });

    if (!updated) {
      throw new NotFoundException(
        `Review with ID ${reviewId} not found after update attempt`,
      );
    }

    return updated;
  }

  /**
   * Deletes a review after confirming ownership or admin role.
   */
  async deleteReview(
    reviewId: number,
    userId: string,
    role: string | undefined,
  ): Promise<void> {
    this.validateId(reviewId, 'Review ID');
    const review = await this.getReviewById(reviewId);
    this.ensureCanMutateReview(review, userId, role);
    await this.repository.remove(reviewId);
  }

  private async getReviewById(reviewId: number): Promise<Review> {
    const review = await this.repository.findById(reviewId);
    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    return review;
  }

  private ensureCanMutateReview(
    review: Review,
    userId: string,
    role: string | undefined,
  ): void {
    if (review.userId === userId || role === UserRole.ADMIN) {
      return;
    }

    throw new ForbiddenException('You can only modify your own reviews');
  }

  private validateId(id: number, fieldName: string): void {
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException(`${fieldName} must be a positive integer`);
    }
  }

  private validateRating(rating: number): void {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new BadRequestException(
        'Review rating must be an integer from 1 to 5',
      );
    }
  }

  private normalizeOptionalComment(comment?: string): string | undefined {
    if (comment === undefined) {
      return undefined;
    }

    return comment.trim();
  }
}
