/**
 * @file gameDto.ts
 * @purpose Defines the structure and validation rules for incoming game data.
 * @overview Contains Data Transfer Objects (DTOs) utilized when creating or modifying Game entities. It leverages `class-validator` for automatic data sanitization and type enforcement.
 * @responsibilities Ensures HTTP request payloads adhere to the required schema before they reach the controller layer. Allows for strict typing throughout the service layer.
 * @interaction GameController heavily relies on these DTOs to bind and validate `@Body()` parameters.
 */
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';

/**
 * Data Transfer Object utilized for the creation of a new Game entity.
 * 
 * @class CreateGameDto
 * @description Specifies the exact properties, data types, and validation rules required to establish a valid Game entry in the system.
 */
export class CreateGameDto {
  /**
   * The required official title for the new game.
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * An optional text summary or description representing the game's contents.
   * @type {string | undefined}
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * An optional release date; validated as a valid ISO-8601 date string.
   * @type {Date | undefined}
   */
  @IsOptional()
  @IsDateString()
  releaseDate?: Date;

  /**
   * The required standard price of the game. It cannot drop below 0.
   * @type {number}
   */
  @IsNumber()
  @Min(0)
  basePrice: number;

  /**
   * Optional name of the development studio behind the game.
   * @type {string | undefined}
   */
  @IsOptional()
  @IsString()
  developer?: string;

  /**
   * Optional name of the publishing company pushing the game to market.
   * @type {string | undefined}
   */
  @IsOptional()
  @IsString()
  publisher?: string;

  /**
   * Optional age classification rating, such as "E" for Everyone or "M" for Mature.
   * @type {string | undefined}
   */
  @IsOptional()
  @IsString()
  ageRating?: string;
}

/**
 * Data Transfer Object facilitating partial updates to an existing Game.
 * 
 * @class UpdateGameDto
 * @description Mirrors `CreateGameDto`, but explicitly marks every property as optional, allowing clients to send only the fields that require mutation.
 */
export class UpdateGameDto {
  /**
   * The updated title for the game, if substituting the existing one.
   * @type {string | undefined}
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  /**
   * The updated description for the game.
   * @type {string | undefined}
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * An updated ISO-8601 release date.
   * @type {Date | undefined}
   */
  @IsOptional()
  @IsDateString()
  releaseDate?: Date;

  /**
   * An updated standard price; enforced to be greater than or equal to 0.
   * @type {number | undefined}
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  /**
   * An updated developer studio identity.
   * @type {string | undefined}
   */
  @IsOptional()
  @IsString()
  developer?: string;

  /**
   * An updated publishing entity identity.
   * @type {string | undefined}
   */
  @IsOptional()
  @IsString()
  publisher?: string;

  /**
   * An updated age classification rating string.
   * @type {string | undefined}
   */
  @IsOptional()
  @IsString()
  ageRating?: string;
}