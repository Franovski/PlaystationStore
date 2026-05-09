/**
 * @file customerDashboardTypes.ts
 * @purpose Defines GraphQL response types for the customer dashboard summary.
 * @overview Aggregates wallet, wishlist, library, and order data into one authenticated dashboard response.
 * @responsibilities Provides stable dashboard counts and recent records without accepting manual user IDs.
 * @interaction Returned by CustomerDashboardResolver for the user dashboard frontend.
 */
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Wishlist } from '../wishlist/wishlistEntity';
import { UserLibrary } from '../userLibrary/userLibraryEntity';
import { Order } from '../orders/orderEntity';
import { UserWallet } from '../userWallet/userWalletEntity';

/**
 * Aggregated current-user dashboard data.
 *
 * @class CustomerDashboardData
 */
@ObjectType()
export class CustomerDashboardData {
  /**
   * Current wallet record.
   */
  @Field(() => UserWallet)
  wallet: UserWallet;

  /**
   * Numeric wallet balance for quick card rendering.
   */
  @Field(() => Float)
  walletBalance: number;

  /**
   * Current wishlist entries.
   */
  @Field(() => [Wishlist])
  wishlist: Wishlist[];

  /**
   * Current owned library entries.
   */
  @Field(() => [UserLibrary])
  library: UserLibrary[];

  /**
   * Current user's orders.
   */
  @Field(() => [Order])
  orders: Order[];

  /**
   * Wishlist count.
   */
  @Field(() => Int)
  wishlistCount: number;

  /**
   * Library item count.
   */
  @Field(() => Int)
  libraryCount: number;

  /**
   * Order count.
   */
  @Field(() => Int)
  orderCount: number;
}
