/**
 * @file orderItemModule.ts
 * @purpose Registers order item providers and persistence metadata.
 * @overview Binds the OrderItem entity, Order entity lookup, repository, service, and resolver.
 * @responsibilities Exports OrderItemRepository for order creation workflows.
 * @interaction Imported by AppModule and OrdersModule.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './orderItemEntity';
import { OrderItemRepository } from './orderItemRepository';
import { OrderItemService } from './orderItemService';
import { OrderItemResolver } from './orderItemResolver';
import { Order } from '../orders/orderEntity';
import { GameModule } from '../games/gameModule';
import { DLCModule } from '../dlc/dlcModule';
import { EditionModule } from '../editions/editionModule';

/**
 * Module encapsulating order item behavior.
 *
 * @class OrderItemModule
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem, Order]),
    GameModule,
    DLCModule,
    EditionModule,
  ],
  providers: [OrderItemRepository, OrderItemService, OrderItemResolver],
  exports: [OrderItemRepository, OrderItemService],
})
export class OrderItemModule {}
