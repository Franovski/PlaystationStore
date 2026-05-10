/**
 * @file orderResolver.ts
 * @purpose Exposes GraphQL operations for customer orders.
 * @overview Authenticated users can read their order history and create purchases without supplying manual user IDs.
 * @responsibilities Routes order history and purchase mutations into OrdersService.
 * @interaction Used by customer dashboard and purchase flows.
 */
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Order } from './orderEntity';
import { OrdersService } from './orderService';
import { CreateOrderDto } from './orderDto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from '../users/userEntity';
import {
  getAuthenticatedUser,
  GraphqlContext,
} from '../auth/types/auth-context';

/**
 * Resolver for order operations.
 *
 * @class OrderResolver
 */
@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Order])
  async orders(@Context() context: GraphqlContext) {
    const user = getAuthenticatedUser(context);

    return this.ordersService.getOrdersForUser(user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Query(() => [Order])
  async adminOrders() {
    return this.ordersService.getAllOrders();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Order)
  async order(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: GraphqlContext,
  ) {
    const user = getAuthenticatedUser(context);

    return this.ordersService.getOrderForUser(id, user.userId, user.role);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Order)
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderDto,
    @Context() context: GraphqlContext,
  ) {
    const user = getAuthenticatedUser(context);

    return this.ordersService.createOrder(user.userId, createOrderInput);
  }
}
