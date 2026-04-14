/**
 * @file gameEntity.ts
 * @purpose Defines the Game entity for the database schema.
 * @overview This file contains the TypeORM entity definition for a physical or digital game product in the store system.
 * @responsibilities Maps the application's Game domain model to the `games` database table.
 * @interaction Interacts with TypeORM for persistence, and is used by the GameRepository, GameService, and other related services for CRUD operations.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Represents a Game entity within the application.
 * 
 * @class Game
 * @description Serves as the primary data model for games, mapping directly to the 'games' table in the database. 
 * It encapsulates all core properties of a game such as title, pricing, release date, and developer information.
 */
@Entity('games')
export class Game {
  /**
   * The unique identifier for the game.
   * Auto-generated primary key.
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  gameId: number;

  /**
   * The official title of the game.
   * @type {string}
   */
  @Column({ type: 'varchar', length: 255 })
  title: string;

  /**
   * A detailed description of the game's contents, storylines, or features.
   * Nullable if no description is provided yet.
   * @type {string}
   */
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * The official release date of the game.
   * Nullable for unannounced or TBD titles.
   * @type {Date}
   */
  @Column({ type: 'date', nullable: true })
  releaseDate: Date;

  /**
   * The standard base price of the game, excluding any discounts or regional pricing.
   * Stored as a decimal with two decimal places.
   * @type {number}
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  /**
   * The studio or company that developed the game.
   * @type {string}
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  developer: string;

  /**
   * The company responsible for publishing the game.
   * @type {string}
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  publisher: string;

  /**
   * The recommended age rating (e.g., ESRB 'M', PEGI 18).
   * @type {string}
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  ageRating: string;
}