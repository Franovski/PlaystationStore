/**
 * @file userWalletResolver.ts
 * @purpose Exposes GraphQL operations for the signed-in user's wallet.
 * @overview Allows customers to read their wallet and add funds through authenticated mutations.
 * @responsibilities Uses token identity instead of accepting manual user IDs from the client.
 * @interaction Used by customer dashboard wallet views and purchase flows.
 */
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserWallet } from './userWalletEntity';
import { UserWalletService } from './userWalletService';
import { AddWalletFundsDto } from './userWalletDto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from '../users/userEntity';
import {
  getAuthenticatedUser,
  GraphqlContext,
} from '../auth/types/auth-context';

/**
 * Resolver for wallet operations.
 *
 * @class UserWalletResolver
 */
@Resolver(() => UserWallet)
export class UserWalletResolver {
  constructor(private readonly walletService: UserWalletService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => UserWallet)
  async wallet(@Context() context: GraphqlContext) {
    const user = getAuthenticatedUser(context);

    return this.walletService.getOrCreateWallet(user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Query(() => [UserWallet])
  async adminWallets() {
    return this.walletService.getAllWallets();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserWallet)
  async addWalletFunds(
    @Args('addWalletFundsInput') addWalletFundsInput: AddWalletFundsDto,
    @Context() context: GraphqlContext,
  ) {
    const user = getAuthenticatedUser(context);

    return this.walletService.addFunds(user.userId, addWalletFundsInput.amount);
  }
}
