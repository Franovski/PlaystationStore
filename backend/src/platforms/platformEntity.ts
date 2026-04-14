/**
 * @file platformEntity.ts
 * @purpose Defines the database entity model and enumerations for gaming platforms.
 * @overview Contains the TypeORM representation for platforms, restricting available options to specific supported consoles like PS4 and PS5.
 * @responsibilities Maps the application's Platform model to the `platforms` database table and enforces allowed platform values.
 * @interaction Interacts tightly with PlatformRepository and type-checks platform enumerations across the platform module.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Enumeration of statically supported platform target names.
 * Ensures data integrity by rejecting unapproved platform values at the application level.
 */
export enum PlatformName {
  PS4 = 'ps4',
  PS5 = 'ps5',
}

/**
 * Target database entity for platforms.
 * 
 * @class Platform
 * @description Provides the data schema corresponding to the `platforms` table, supporting the association of products with supported gaming systems.
 */
@Entity('platforms')
export class Platform {
  /**
   * The automatically generated unique identifier for the targeted platform.
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  platformId: number;

  /**
   * The explicit enumerated string representing the platform type.
   * Restricted dynamically directly at the database column layer ensuring it mirrors standard domain values.
   * @type {PlatformName}
   */
  @Column({ type: 'enum', enum: PlatformName, unique: true })
  platformName: PlatformName;
}
