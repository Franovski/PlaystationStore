/**
 * @file discountModule.ts
 * @purpose Registers discount providers and TypeORM metadata.
 * @overview Binds discount entity, repository, service, and resolver into one NestJS module.
 * @responsibilities Exports DiscountService for pricing and order calculation.
 * @interaction Imported by AppModule, OrdersModule, and storefront detail modules.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './discountEntity';
import { DiscountRepository } from './discountRepository';
import { DiscountService } from './discountService';
import { DiscountResolver } from './discountResolver';
import { GameModule } from '../games/gameModule';

/**
 * Module encapsulating discount behavior.
 *
 * @class DiscountModule
 */
@Module({
  imports: [TypeOrmModule.forFeature([Discount]), GameModule],
  providers: [DiscountRepository, DiscountService, DiscountResolver],
  exports: [DiscountRepository, DiscountService],
})
export class DiscountModule {}
