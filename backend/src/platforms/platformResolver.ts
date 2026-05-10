import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PlatformService } from './platformService';
import { Platform } from './platformEntity';
import { CreatePlatformDto, UpdatePlatformDto } from './platformDto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from '../users/userEntity';

@Resolver(() => Platform)
export class PlatformResolver {
  constructor(private readonly platformService: PlatformService) {}

  @Query(() => [Platform], { name: 'platforms' })
  async getPlatforms() {
    return this.platformService.getAllPlatforms();
  }

  @Query(() => Platform, { nullable: true, name: 'platform' })
  async getPlatformById(
    @Args('platformId', { type: () => Int }) platformId: number,
  ) {
    return this.platformService.getPlatformById(platformId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Platform)
  async createPlatform(
    @Args('createPlatformInput') createPlatformDto: CreatePlatformDto,
  ) {
    return this.platformService.createPlatform(createPlatformDto);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Platform)
  async updatePlatform(
    @Args('platformId', { type: () => Int }) platformId: number,
    @Args('updatePlatformInput') updatePlatformDto: UpdatePlatformDto,
  ) {
    return this.platformService.updatePlatform(platformId, updatePlatformDto);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deletePlatform(
    @Args('platformId', { type: () => Int }) platformId: number,
  ) {
    await this.platformService.deletePlatform(platformId);
    return true;
  }
}
