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
  async wishlist(@Context() context: any) {
    return this.wishlistService.getWishlistForUser(context.req.user.userId);
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
    @Context() context: any,
  ) {
    return this.wishlistService.addWishlistItem(
      context.req.user.userId,
      addWishlistItemInput.gameId,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async removeWishlistItem(
    @Args('gameId', { type: () => Int }) gameId: number,
    @Context() context: any,
  ) {
    await this.wishlistService.removeWishlistItem(
      context.req.user.userId,
      gameId,
    );
    return true;
  }
}
