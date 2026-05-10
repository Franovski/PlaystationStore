/**
 * @file dlcDto.ts
 * @purpose Defines the structure and validation rules for incoming DLC data.
 * @overview Contains Data Transfer Objects DTOs used when creating or modifying DLC entities. It uses `class-validator` for validation and `@nestjs/graphql` decorators for GraphQL input types.
 * @responsibilities Ensures incoming GraphQL payloads follow the required schema before reaching the service layer.
 * @interaction DLCResolver uses these DTOs as mutation inputs, while DLCService and DLCRepository receive them as typed data objects.
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
  IsInt,
} from 'class-validator';
import { InputType, Field, Float, Int } from '@nestjs/graphql';

/**
 * Data Transfer Object used for creating a new DLC entity.
 *
 * @class createDLCDto
 * @description Specifies the required and optional properties needed to create a valid DLC record.
 */
@InputType('CreateDLCDto')
export class CreateDLCDto {
  /**
   * The required name of the downloadable content.
   *
   * @type {string}
   */
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * The required price of the downloadable content. It cannot be less than 0.
   *
   * @type {number}
   */
  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  /**
   * Optional release date of the DLC, validated as an ISO-8601 date string.
   *
   * @type {string | undefined}
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  /**
   * The required ID of the game that this DLC belongs to.
   *
   * @type {number}
   */
  @Field(() => Int)
  @IsInt()
  @Min(1)
  gameId: number;
}

/**
 * Data Transfer Object used for partially updating an existing DLC entity.
 *
 * @class updateDLCDto
 * @description Mirrors createDLCDto, but makes every property optional so clients can update only selected fields.
 */
@InputType('UpdateDLCDto')
export class UpdateDLCDto {
  /**
   * Updated name of the downloadable content.
   *
   * @type {string | undefined}
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  /**
   * Updated price of the downloadable content. It cannot be less than 0.
   *
   * @type {number | undefined}
   */
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  /**
   * Updated release date of the DLC, validated as an ISO-8601 date string.
   *
   * @type {string | undefined}
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  /**
   * Updated ID of the game that this DLC belongs to.
   *
   * @type {number | undefined}
   */
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  gameId?: number;
}
