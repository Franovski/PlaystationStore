/**
 * @file customerDashboardService.ts
 * @purpose Aggregates current-user dashboard data from customer feature modules.
 * @overview Provides a single GraphQL backing service for dashboard summary, wallet, wishlist, library, and order cards.
 * @responsibilities Loads user-scoped data using authenticated user identity only.
 * @interaction Used by CustomerDashboardResolver.
 */
import { Injectable } from '@nestjs/common';
import { CustomerDashboardData } from './customerDashboardTypes';
import { UserWalletService } from '../userWallet/userWalletService';
import { WishlistService } from '../wishlist/wishlistService';
import { UserLibraryService } from '../userLibrary/userLibraryService';
import { OrdersService } from '../orders/orderService';

/**
 * Service for current-user dashboard aggregation.
 *
 * @class CustomerDashboardService
 */
@Injectable()
export class CustomerDashboardService {
  constructor(
    private readonly walletService: UserWalletService,
    private readonly wishlistService: WishlistService,
    private readonly libraryService: UserLibraryService,
    private readonly ordersService: OrdersService,
  ) {}

  /**
   * Builds dashboard data for the authenticated user.
   */
  async getDashboardData(userId: string): Promise<CustomerDashboardData> {
    const [wallet, wishlist, library, orders] = await Promise.all([
      this.walletService.getOrCreateWallet(userId),
      this.wishlistService.getWishlistForUser(userId),
      this.libraryService.getLibraryForUser(userId),
      this.ordersService.getOrdersForUser(userId),
    ]);

    return {
      wallet,
      walletBalance: Number(wallet.balance),
      wishlist,
      library,
      orders,
      wishlistCount: wishlist.length,
      libraryCount: library.length,
      orderCount: orders.length,
    };
  }
}
