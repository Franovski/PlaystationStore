/**
 * @file customerDashboardModule.ts
 * @purpose Registers customer dashboard aggregation providers.
 * @overview Imports user-scoped feature modules and exposes the currentUserDashboard query.
 * @responsibilities Keeps dashboard aggregation separate from individual domain modules.
 * @interaction Imported by AppModule for the customer dashboard frontend.
 */
import { Module } from '@nestjs/common';
import { CustomerDashboardService } from './customerDashboardService';
import { CustomerDashboardResolver } from './customerDashboardResolver';
import { UserWalletModule } from '../userWallet/userWalletModule';
import { WishlistModule } from '../wishlist/wishlistModule';
import { UserLibraryModule } from '../userLibrary/userLibraryModule';
import { OrderModule } from '../orders/orderModule';

/**
 * Module encapsulating customer dashboard aggregation.
 *
 * @class CustomerDashboardModule
 */
@Module({
  imports: [UserWalletModule, WishlistModule, UserLibraryModule, OrderModule],
  providers: [CustomerDashboardService, CustomerDashboardResolver],
})
export class CustomerDashboardModule {}
