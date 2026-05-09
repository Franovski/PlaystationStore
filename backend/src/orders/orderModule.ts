/**
 * @file orderModule.ts
 * @purpose Registers order providers and purchase workflow dependencies.
 * @overview Binds order persistence, resolver, and service while importing pricing, wallet, and library modules.
 * @responsibilities Exports OrdersService for customer dashboard aggregation.
 * @interaction Imported by AppModule and dashboard modules.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orderEntity';
import { OrderRepository } from './orderRepository';
import { OrdersService } from './orderService';
import { OrderResolver } from './orderResolver';
import { GameModule } from '../games/gameModule';
import { DLCModule } from '../dlc/dlcModule';
import { EditionModule } from '../editions/editionModule';
import { DiscountModule } from '../discounts/discountModule';
import { UserWalletModule } from '../userWallet/userWalletModule';
import { UserLibraryModule } from '../userLibrary/userLibraryModule';
import { OrderItemModule } from '../orderItems/orderItemModule';
import { OrderItem } from '../orderItems/orderItemEntity';

/**
 * Module encapsulating order behavior.
 *
 * @class OrderModule
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    GameModule,
    DLCModule,
    EditionModule,
    DiscountModule,
    UserWalletModule,
    UserLibraryModule,
    OrderItemModule,
  ],
  providers: [OrderRepository, OrdersService, OrderResolver],
  exports: [OrderRepository, OrdersService],
})
export class OrderModule {}
