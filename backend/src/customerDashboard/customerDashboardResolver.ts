/**
 * @file customerDashboardResolver.ts
 * @purpose Exposes authenticated dashboard aggregation queries.
 * @overview Provides one current-user dashboard operation without accepting client-supplied user IDs.
 * @responsibilities Routes dashboard GraphQL queries into CustomerDashboardService.
 * @interaction Used by the React customer dashboard.
 */
import { Context, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CustomerDashboardData } from './customerDashboardTypes';
import { CustomerDashboardService } from './customerDashboardService';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import {
  getAuthenticatedUser,
  GraphqlContext,
} from '../auth/types/auth-context';

/**
 * Resolver for customer dashboard data.
 *
 * @class CustomerDashboardResolver
 */
@Resolver(() => CustomerDashboardData)
export class CustomerDashboardResolver {
  constructor(private readonly dashboardService: CustomerDashboardService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => CustomerDashboardData)
  async currentUserDashboard(@Context() context: GraphqlContext) {
    const user = getAuthenticatedUser(context);

    return this.dashboardService.getDashboardData(user.userId);
  }
}
