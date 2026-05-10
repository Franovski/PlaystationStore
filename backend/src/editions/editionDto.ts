/**
 * @file editionDto.ts
 * @purpose Defines GraphQL input contracts for creating and updating game editions.
 * @overview Uses class-validator rules to keep edition data structurally safe before service logic runs.
 * @responsibilities Validates edition name, price, included content, and parent game identifiers.
 * @interaction Consumed by EditionResolver and EditionService during mutation workflows.
 */
import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

/**
 * Input payload for creating a new edition.
 *
 * @class CreateEditionDto
 */
@InputType()
export class CreateEditionDto {
  /**
   * Display name for the edition.
   */
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Purchasable price for the edition.
   */
  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  /**
   * Optional content notes for the edition.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  includes?: string;

  /**
   * Parent game identifier.
   */
  @Field(() => Int)
  @IsInt()
  @Min(1)
  gameId: number;
}

/**
 * Input payload for partially updating an edition.
 *
 * @class UpdateEditionDto
 */
@InputType()
export class UpdateEditionDto {
  /**
   * Updated edition name.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  /**
   * Updated edition price.
   */
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  /**
   * Updated content notes.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  includes?: string;

  /**
   * Updated parent game identifier.
   */
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  gameId?: number;
}
