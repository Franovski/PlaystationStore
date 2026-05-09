/**
 * @file editionModule.ts
 * @purpose Registers the edition feature slice with NestJS dependency injection.
 * @overview Binds the TypeORM entity, repository, service, and resolver for game editions.
 * @responsibilities Makes EditionService available to purchasing, library, and storefront modules.
 * @interaction Imported by AppModule and any feature that validates or displays editions.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edition } from './editionEntity';
import { EditionRepository } from './editionRepository';
import { EditionService } from './editionService';
import { EditionResolver } from './editionResolver';
import { GameModule } from '../games/gameModule';

/**
 * Module encapsulating edition behavior.
 *
 * @class EditionModule
 */
@Module({
  imports: [TypeOrmModule.forFeature([Edition]), GameModule],
  providers: [EditionRepository, EditionService, EditionResolver],
  exports: [EditionRepository, EditionService],
})
export class EditionModule {}
