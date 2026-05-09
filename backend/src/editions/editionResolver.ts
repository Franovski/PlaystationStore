/**
 * @file editionResolver.ts
 * @purpose Exposes GraphQL operations for editions.
 * @overview Provides read access for storefront flows and admin-protected mutations for edition management.
 * @responsibilities Routes GraphQL queries and mutations into EditionService.
 * @interaction Used by Apollo clients and dashboard screens that need edition data.
 */
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Edition } from './editionEntity';
import { EditionService } from './editionService';
import { CreateEditionDto, UpdateEditionDto } from './editionDto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from '../users/userEntity';

/**
 * GraphQL resolver for game editions.
 *
 * @class EditionResolver
 */
@Resolver(() => Edition)
export class EditionResolver {
  constructor(private readonly editionService: EditionService) {}

  @Query(() => [Edition])
  async editions(@Args('gameId', { type: () => Int, nullable: true }) gameId?: number) {
    if (gameId) {
      return this.editionService.getEditionsByGameId(gameId);
    }

    return this.editionService.getAllEditions();
  }

  @Query(() => Edition)
  async edition(@Args('id', { type: () => Int }) id: number) {
    return this.editionService.getEditionById(id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Edition)
  async createEdition(@Args('createEditionInput') createEditionInput: CreateEditionDto) {
    return this.editionService.createEdition(createEditionInput);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Edition)
  async updateEdition(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateEditionInput') updateEditionInput: UpdateEditionDto,
  ) {
    return this.editionService.updateEdition(id, updateEditionInput);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deleteEdition(@Args('id', { type: () => Int }) id: number) {
    await this.editionService.deleteEdition(id);
    return true;
  }
}
