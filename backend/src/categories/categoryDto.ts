/**
 * @file categoryDto.ts
 * @purpose Establishes the expected data shapes and validation criteria for Category requests.
 * @overview Utilizes `class-validator` to enforce correct client request data (e.g., ensuring a category name is provided).
 * @responsibilities Defines typings for Create vs Update logic, ensuring the controller receives valid incoming payloads.
 * @interaction Accessed primarily by the system's CategoryController as the schema definition for `@Body()` injections.
 */
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Validates the data required to instantiate a brand new Category.
 * 
 * @class CreateCategoryDto
 * @description Requires the client to formally establish the category name explicitly. 
 */
export class CreateCategoryDto {
  /**
   * The intended display name of the category (e.g. 'Sports').
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  categoryName: string;
}

/**
 * Validates data for amending pre-existing Categories.
 * 
 * @class UpdateCategoryDto
 * @description Keeps fields optional so HTTP PATCH/PUT calls can supply partial modifications smoothly.
 */
export class UpdateCategoryDto {
  /**
   * The replacement display name of the category.
   * If provided, it cannot be completely empty.
   * @type {string | undefined}
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categoryName?: string;
}