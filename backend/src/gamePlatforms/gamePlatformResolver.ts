import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GamePlatformService } from './gamePlatformService';
import { GamePlatform } from './gamePlatformEntity';
import { Platform } from '../platforms/platformEntity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from '../users/userEntity';

@Resolver(() => GamePlatform)
export class GamePlatformResolver {
  constructor(private readonly gamePlatformService: GamePlatformService) {}

  @Query(() => [GamePlatform])
  async gamePlatforms() {
    return this.gamePlatformService.getAllGamePlatforms();
  }

  @Query(() => [Platform])
  async gamePlatformsByGameId(
    @Args('gameId', { type: () => Int }) gameId: number,
  ) {
    return this.gamePlatformService.getPlatformsByGame(gameId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => GamePlatform)
  async addPlatformToGame(
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('platformId', { type: () => Int }) platformId: number,
  ) {
    return this.gamePlatformService.linkGameAndPlatform({ gameId, platformId });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async removePlatformFromGame(
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('platformId', { type: () => Int }) platformId: number,
  ) {
    await this.gamePlatformService.unlinkGameAndPlatform(gameId, platformId);
    return true;
  }
}
