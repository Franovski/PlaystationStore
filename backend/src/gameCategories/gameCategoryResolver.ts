import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GameCategoryService } from './gameCategoryService';
import { GameCategory } from './gameCategoryEntity';
import { Category } from '../categories/categoryEntity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from '../users/userEntity';

@Resolver(() => GameCategory)
export class GameCategoryResolver {
  constructor(private readonly gameCategoryService: GameCategoryService) {}

  @Query(() => [GameCategory])
  async gameCategories() {
    return this.gameCategoryService.getAllGameCategories();
  }

  @Query(() => [Category])
  async gameCategoriesByGameId(
    @Args('gameId', { type: () => Int }) gameId: number,
  ) {
    return this.gameCategoryService.getCategoriesByGame(gameId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => GameCategory)
  async addCategoryToGame(
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ) {
    return this.gameCategoryService.linkGameAndCategory({ gameId, categoryId });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async removeCategoryFromGame(
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ) {
    await this.gameCategoryService.unlinkGameAndCategory(gameId, categoryId);
    return true;
  }
}
