/**
 * @file reviewResolver.ts
 * @purpose Exposes GraphQL review operations.
 * @overview Publicly reads game reviews and protects create/update/delete operations with authentication.
 * @responsibilities Routes GraphQL operations into ReviewService with token-derived user identity.
 * @interaction Used by game detail pages and customer review forms.
 */
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Review } from './reviewEntity';
import { ReviewService } from './reviewService';
import { CreateReviewDto, UpdateReviewDto } from './reviewDto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from '../users/userEntity';
import {
  getAuthenticatedUser,
  GraphqlContext,
} from '../auth/types/auth-context';

/**
 * Resolver for review operations.
 *
 * @class ReviewResolver
 */
@Resolver(() => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query(() => [Review])
  async reviewsForGame(@Args('gameId', { type: () => Int }) gameId: number) {
    return this.reviewService.getReviewsForGame(gameId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Query(() => [Review])
  async adminReviews() {
    return this.reviewService.getAllReviews();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Review)
  async createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewDto,
    @Context() context: GraphqlContext,
  ) {
    const user = getAuthenticatedUser(context);

    return this.reviewService.createReview(user.userId, createReviewInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Review)
  async updateReview(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateReviewInput') updateReviewInput: UpdateReviewDto,
    @Context() context: GraphqlContext,
  ) {
    const user = getAuthenticatedUser(context);

    return this.reviewService.updateReview(
      id,
      user.userId,
      user.role,
      updateReviewInput,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteReview(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: GraphqlContext,
  ) {
    const user = getAuthenticatedUser(context);

    await this.reviewService.deleteReview(id, user.userId, user.role);
    return true;
  }
}
