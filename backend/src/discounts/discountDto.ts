/**
 * @file discountDto.ts
 * @purpose Defines GraphQL input contracts for discount mutation requests.
 * @overview Applies validation for percentage values, date windows, and game identifiers.
 * @responsibilities Keeps incoming discount payloads consistent before service-level business checks run.
 * @interaction Consumed by DiscountResolver and DiscountService.
 */
import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

/**
 * Payload used to create a discount.
 *
 * @class CreateDiscountDto
 */
@InputType()
export class CreateDiscountDto {
  /**
   * Discount percentage.
   */
  @Field(() => Float)
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  /**
   * Discount start date.
   */
  @Field()
  @IsDateString()
  startDate: string;

  /**
   * Discount end date.
   */
  @Field()
  @IsDateString()
  endDate: string;

  /**
   * Discounted game identifier.
   */
  @Field(() => Int)
  @IsInt()
  @Min(1)
  gameId: number;
}

/**
 * Payload used to update a discount partially.
 *
 * @class UpdateDiscountDto
 */
@InputType()
export class UpdateDiscountDto {
  /**
   * Updated discount percentage.
   */
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage?: number;

  /**
   * Updated start date.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  /**
   * Updated end date.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  /**
   * Updated game identifier.
   */
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  gameId?: number;
}
