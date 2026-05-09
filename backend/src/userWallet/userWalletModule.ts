/**
 * @file userWalletModule.ts
 * @purpose Registers wallet providers and persistence metadata.
 * @overview Binds the wallet entity, repository, service, and resolver.
 * @responsibilities Exports UserWalletService for order payment validation.
 * @interaction Imported by AppModule, OrdersModule, and customer dashboard aggregation.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWallet } from './userWalletEntity';
import { UserWalletRepository } from './userWalletRepository';
import { UserWalletService } from './userWalletService';
import { UserWalletResolver } from './userWalletResolver';

/**
 * Module encapsulating wallet behavior.
 *
 * @class UserWalletModule
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserWallet])],
  providers: [UserWalletRepository, UserWalletService, UserWalletResolver],
  exports: [UserWalletRepository, UserWalletService],
})
export class UserWalletModule {}
