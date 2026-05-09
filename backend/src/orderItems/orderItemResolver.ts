/**
 * @file orderItemResolver.ts
 * @purpose Exposes GraphQL operations for reading order line items.
 * @overview Authenticates access and enforces order ownership.
 * @responsibilities Routes order item queries to OrderItemService.
 * @interaction Used by order history screens when expanded item details are needed.
 */
import { Args, Context, Int, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrderItem } from './orderItemEntity';
import { OrderItemService } from './orderItemService';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from '../users/userEntity';

/**
 * Resolver for order item operations.
 *
 * @class OrderItemResolver
 */
@Resolver(() => OrderItem)
export class OrderItemResolver {
  constructor(private readonly orderItemService: OrderItemService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [OrderItem])
  async orderItems(
    @Args('orderId', { type: () => Int }) orderId: number,
    @Context() context: any,
  ) {
    return this.orderItemService.getItemsForOrder(
      orderId,
      context.req.user.userId,
      context.req.user.role,
    );
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Query(() => [OrderItem])
  async adminOrderItems() {
    return this.orderItemService.getAllItems();
  }
}
