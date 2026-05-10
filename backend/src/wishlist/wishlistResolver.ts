/**
 * @file wishlistResolver.ts
 * @purpose Exposes GraphQL operations for customer wishlist management.
 * @overview All mutations use the authenticated token identity rather than client-provided user IDs.
 * @responsibilities Routes wishlist reads, adds, and removals to WishlistService.
 * @interaction Used by customer dashboard and game detail pages.
 */
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Wishlist } from './wishlistEntity';
import { WishlistService } from './wishlistService';
import { AddWishlistItemDto } from './wishlistDto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from '../users/userEntity';
import {
  getAuthenticatedUser,
  GraphqlContext,
} from '../auth/types/auth-context';

/**
 * Resolver for wishlist operations.
 *
 * @class WishlistResolver
 */
@Resolver(() => Wishlist)
export class WishlistResolver {
  constructor(private readonly wishlistService: WishlistService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Wishlist])
  async wishlist(@Context() context: GraphqlContext) {
    const user = getAuthenticatedUser(context);

    return this.wishlistService.getWishlistForUser(user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Query(() => [Wishlist])
  async adminWishlists() {
    return this.wishlistService.getAllWishlistItems();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Wishlist)
  async addWishlistItem(
    @Args('addWishlistItemInput') addWishlistItemInput: AddWishlistItemDto,
    @Context() context: GraphqlContext,
  ) {
    const user = getAuthenticatedUser(context);

    return this.wishlistService.addWishlistItem(
      user.userId,
      addWishlistItemInput.gameId,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async removeWishlistItem(
    @Args('gameId', { type: () => Int }) gameId: number,
    @Context() context: GraphqlContext,
  ) {
    const user = getAuthenticatedUser(context);

    await this.wishlistService.removeWishlistItem(user.userId, gameId);
    return true;
  }
}
