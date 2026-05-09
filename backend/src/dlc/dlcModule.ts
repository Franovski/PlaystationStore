/**
 * @file dlcModule.ts
 * @purpose Organizes the DLC feature scope into a cohesive, injectable NestJS module.
 * @overview Acts as the central integration point for downloadable-content-related components, binding the Resolver, Service, and Repository together with TypeORM configurations.
 * @responsibilities Declares internal providers, imported features such as TypeORM, and exports DLC-related services for external consumption by other modules.
 * @interaction Imported by the root `AppModule` and exports its providers (`DLCService`, `DLCRepository`) to be utilized across different feature modules within the system.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DLC } from './dlcEntity';
import { DLCService } from './dlcService';
import { DLCRepository } from './dlcRepository';
import { DLCResolver } from './dlcResolver';
import { GameModule } from '../games/gameModule';

/**
 * Functional module encapsulating everything tied directly to DLC management.
 *
 * @class DLCModule
 * @description Encapsulates instantiation and dependency injection configurations for GraphQL operations, business logic, repositories, and TypeORM entities linked specifically to downloadable content. Ensures isolation and modularity in the overall NestJS architecture.
 */
@Module({
    // Registers the 'DLC' entity into TypeORM's ecosystem for this module context.
    imports: [TypeOrmModule.forFeature([DLC]), GameModule],

    // Defines the injectable services and resolver constructed when the application initializes.
    providers: [DLCService, DLCRepository, DLCResolver],

    // Exposes specific classes so other modules can reuse DLC business and persistence logic.
    exports: [DLCService, DLCRepository],
})
export class DLCModule { }
