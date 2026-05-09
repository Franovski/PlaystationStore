/**
 * @file wishlistModule.ts
 * @purpose Registers wishlist providers and persistence metadata.
 * @overview Binds wishlist entity, repository, service, and resolver.
 * @responsibilities Exports WishlistService for dashboard aggregation.
 * @interaction Imported by AppModule and customer dashboard modules.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './wishlistEntity';
import { WishlistRepository } from './wishlistRepository';
import { WishlistService } from './wishlistService';
import { WishlistResolver } from './wishlistResolver';
import { GameModule } from '../games/gameModule';

/**
 * Module encapsulating wishlist behavior.
 *
 * @class WishlistModule
 */
@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), GameModule],
  providers: [WishlistRepository, WishlistService, WishlistResolver],
  exports: [WishlistRepository, WishlistService],
})
export class WishlistModule {}
