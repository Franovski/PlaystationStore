/**
 * @file userLibraryResolver.ts
 * @purpose Exposes GraphQL operations for the signed-in user's library.
 * @overview Reads use token identity and avoid accepting manual user IDs from the client.
 * @responsibilities Routes library listing and controlled ownership grants to UserLibraryService.
 * @interaction Used by customer dashboard and purchase fulfillment verification.
 */
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserLibrary } from './userLibraryEntity';
import { UserLibraryService } from './userLibraryService';
import { AddLibraryItemDto } from './userLibraryDto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from '../users/userEntity';

/**
 * Resolver for library ownership.
 *
 * @class UserLibraryResolver
 */
@Resolver(() => UserLibrary)
export class UserLibraryResolver {
  constructor(private readonly libraryService: UserLibraryService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [UserLibrary])
  async userLibrary(@Context() context: any) {
    return this.libraryService.getLibraryForUser(context.req.user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Query(() => [UserLibrary])
  async adminUserLibrary() {
    return this.libraryService.getAllLibraryItems();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserLibrary)
  async addLibraryItem(
    @Args('addLibraryItemInput') addLibraryItemInput: AddLibraryItemDto,
    @Context() context: any,
  ) {
    return this.libraryService.grantOwnership(
      context.req.user.userId,
      addLibraryItemInput.itemType,
      addLibraryItemInput.itemId,
    );
  }
}
