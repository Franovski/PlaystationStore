import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/userService';
import { GameService } from '../games/gameService';
import { CategoryService } from '../categories/categoryService';
import { PlatformService } from '../platforms/platformService';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from '../users/userEntity';
import { CreateUserDto, UpdateUserDto } from '../users/userDto';
import { CreateGameDto, UpdateGameDto } from '../games/gameDto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly gameService: GameService,
    private readonly categoryService: CategoryService,
    private readonly platformService: PlatformService,
  ) {}

  @Get('dashboard/summary')
  async getDashboardSummary() {
    const users = await this.usersService.findAll();
    const games = await this.gameService.getAllGames();
    const categories = await this.categoryService.getAllCategories();
    const platforms = await this.platformService.getAllPlatforms();

    return {
      totalUsers: users.length,
      totalAdmins: users.filter((u) => u.role === UserRole.ADMIN).length,
      totalCustomers: users.filter(
        (u) => u.role === UserRole.PLAYSTATION_USER,
      ).length,
      totalGames: games.length,
      totalCategories: categories.length,
      totalPlatforms: platforms.length,
    };
  }

  // --- USERS ---
  @Get('users')
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findById(id as any);
    return user ? this.usersService.sanitizeUser(user) : null;
  }

  @Post('users')
  async createUser(@Body() createDto: CreateUserDto) {
    const user = await this.usersService.create(createDto);
    return this.usersService.sanitizeUser(user);
  }

  @Patch('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    const user = await this.usersService.update(id as any, updateDto, {
      allowRoleChange: true,
    });

    return this.usersService.sanitizeUser(user);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.remove(id as any);
    return { message: 'User deleted successfully' };
  }

  // --- GAMES ---
  @Get('games')
  async getAllGames() {
    return this.gameService.getAllGames();
  }

  @Get('games/:id')
  async getGame(@Param('id') id: string) {
    return this.gameService.getGameById(+id);
  }

  @Post('games')
  async createGame(@Body() createDto: CreateGameDto) {
    return this.gameService.createGame(createDto);
  }

  @Patch('games/:id')
  async updateGame(@Param('id') id: string, @Body() updateDto: UpdateGameDto) {
    return this.gameService.updateGame(+id, updateDto);
  }

  @Delete('games/:id')
  async deleteGame(@Param('id') id: string) {
    return this.gameService.deleteGame(+id);
  }
}