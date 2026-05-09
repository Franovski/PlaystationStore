/**
 * @file userLibraryModule.ts
 * @purpose Registers user library providers and persistence metadata.
 * @overview Binds ownership entity, repository, service, and resolver.
 * @responsibilities Exports UserLibraryService for purchase fulfillment and review validation.
 * @interaction Imported by AppModule, OrdersModule, ReviewsModule, and dashboard modules.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLibrary } from './userLibraryEntity';
import { UserLibraryRepository } from './userLibraryRepository';
import { UserLibraryService } from './userLibraryService';
import { UserLibraryResolver } from './userLibraryResolver';
import { GameModule } from '../games/gameModule';
import { DLCModule } from '../dlc/dlcModule';
import { EditionModule } from '../editions/editionModule';

/**
 * Module encapsulating user library behavior.
 *
 * @class UserLibraryModule
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserLibrary]), GameModule, DLCModule, EditionModule],
  providers: [UserLibraryRepository, UserLibraryService, UserLibraryResolver],
  exports: [UserLibraryRepository, UserLibraryService],
})
export class UserLibraryModule {}
