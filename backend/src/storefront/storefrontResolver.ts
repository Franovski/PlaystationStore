/**
 * @file storefrontResolver.ts
 * @purpose Exposes customer-facing GraphQL store queries.
 * @overview Provides catalog and full game detail responses assembled from existing feature modules.
 * @responsibilities Keeps storefront reads separate from admin CRUD behavior.
 * @interaction Used by public browsing, customer dashboard browsing, and game detail pages.
 */
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { GameDetails } from './storefrontTypes';
import { StorefrontService } from './storefrontService';

/**
 * Resolver for store aggregation queries.
 *
 * @class StorefrontResolver
 */
@Resolver(() => GameDetails)
export class StorefrontResolver {
  constructor(private readonly storefrontService: StorefrontService) {}

  @Query(() => [GameDetails])
  async gameCatalog() {
    return this.storefrontService.getGameCatalog();
  }

  @Query(() => GameDetails)
  async gameDetails(@Args('gameId', { type: () => Int }) gameId: number) {
    return this.storefrontService.getGameDetails(gameId);
  }
}
