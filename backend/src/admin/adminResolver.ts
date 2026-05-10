import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DashboardSummary } from './adminTypes';
import { UsersService } from '../users/userService';
import { GameService } from '../games/gameService';
import { CategoryService } from '../categories/categoryService';
import { PlatformService } from '../platforms/platformService';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from '../users/userEntity';

@Resolver(() => DashboardSummary)
@UseGuards(GqlAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly gameService: GameService,
    private readonly categoryService: CategoryService,
    private readonly platformService: PlatformService,
  ) {}

  @Query(() => DashboardSummary)
  async dashboardSummary(): Promise<DashboardSummary> {
    const users = await this.usersService.findAll();
    const games = await this.gameService.getAllGames();
    const categories = await this.categoryService.getAllCategories();
    const platforms = await this.platformService.getAllPlatforms();

    return {
      totalUsers: users.length,
      totalAdmins: users.filter((u) => u.role === UserRole.ADMIN).length,
      totalCustomers: users.filter((u) => u.role === UserRole.PLAYSTATION_USER)
        .length,
      totalGames: games.length,
      totalCategories: categories.length,
      totalPlatforms: platforms.length,
    };
  }
}
