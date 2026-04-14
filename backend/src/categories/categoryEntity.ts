/**
 * @file categoryEntity.ts
 * @purpose Defines the database entity model for categories.
 * @overview This file contains the TypeORM entity configuration for game/product categories (e.g., 'Action', 'RPG', 'Shooter').
 * @responsibilities Maps the Category domain model to the `categories` database table.
 * @interaction Used by the CategoryRepository to query and persist category configurations.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Represents a Category entity within the application.
 * 
 * @class Category
 * @description Serves as the primary data model for categories, mapping directly to the 'categories' table in the database.
 * Used for grouping and classifying games in the store.
 */
@Entity('categories')
export class Category {
  /**
   * The unique identifier for a category.
   * Auto-generated primary key.
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  categoryId: number;

  /**
   * The display name of the category.
   * Must be unique across all categories to prevent duplicates (e.g., two "Action" categories).
   * @type {string}
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  categoryName: string;
}
