/**
 * @file reviewDto.ts
 * @purpose Defines GraphQL input contracts for review mutations.
 * @overview Validates review ratings, comments, and target game identifiers.
 * @responsibilities Keeps review payloads structurally safe before ownership rules execute.
 * @interaction Consumed by ReviewResolver and ReviewService.
 */
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * Payload used to create a review.
 *
 * @class CreateReviewDto
 */
@InputType()
export class CreateReviewDto {
  /**
   * Game being reviewed.
   */
  @Field(() => Int)
  @IsInt()
  @Min(1)
  gameId: number;

  /**
   * Rating value from 1 to 5.
   */
  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  /**
   * Optional text comment.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  comment?: string;
}

/**
 * Payload used to update a review.
 *
 * @class UpdateReviewDto
 */
@InputType()
export class UpdateReviewDto {
  /**
   * Updated rating value from 1 to 5.
   */
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  /**
   * Updated review comment.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  comment?: string;
}
