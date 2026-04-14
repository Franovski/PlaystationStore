/**
 * @file gameModule.ts
 * @purpose Organizes the games feature scope into a cohesive, injectable NestJS module.
 * @overview Acts as the central integration point for game-related components, binding the Controller, Service, and Repository together with TypeORM configurations.
 * @responsibilities Declares internal providers, imported features (e.g., TypeORM), and exports game-related services for external consumption by other modules.
 * @interaction Imported by the root `AppModule` and exports its providers (`GameService`, `GameRepository`) to be utilized across different feature modules within the system.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './gameEntity';
import { GameController } from './gameController';
import { GameService } from './gameService';
import { GameRepository } from './gameRepository';

/**
 * Functional module encapsulating everything tied directly to Game management.
 * 
 * @class GameModule
 * @description Encapsulates instantiation and dependency injection configurations for endpoints, business logic, and TypeORM entities linked specifically to games. Ensures isolation and modularity in the overall NestJS architecture.
 */
@Module({
  // Registers the 'Game' entity securely into TypeORM's ecosystem for this context.
  imports: [TypeOrmModule.forFeature([Game])],
  
  // Registers controllers handling routing tied explicitly to '/games'
  controllers: [GameController],
  
  // Defines the injectable services constructed when the application initializes.
  providers: [GameService, GameRepository],
  
  // Exposes specific classes allowing sibling modules to share these providers.
  exports: [GameService, GameRepository],
})
export class GameModule {}