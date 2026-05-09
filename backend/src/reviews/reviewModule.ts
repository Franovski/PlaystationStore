/**
 * @file reviewModule.ts
 * @purpose Registers review providers and persistence metadata.
 * @overview Binds review entity, repository, service, and resolver.
 * @responsibilities Exports ReviewService for storefront game detail aggregation.
 * @interaction Imported by AppModule and StorefrontModule.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './reviewEntity';
import { ReviewRepository } from './reviewRepository';
import { ReviewService } from './reviewService';
import { ReviewResolver } from './reviewResolver';
import { GameModule } from '../games/gameModule';
import { UserLibraryModule } from '../userLibrary/userLibraryModule';

/**
 * Module encapsulating review behavior.
 *
 * @class ReviewModule
 */
@Module({
  imports: [TypeOrmModule.forFeature([Review]), GameModule, UserLibraryModule],
  providers: [ReviewRepository, ReviewService, ReviewResolver],
  exports: [ReviewRepository, ReviewService],
})
export class ReviewModule {}
