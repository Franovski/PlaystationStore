import { Controller, Post, Delete, Get, Param, ParseIntPipe, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { GamePlatformService } from './gamePlatformService';
import { AddGamePlatformDto } from './gamePlatformDto';

@Controller('game-platforms')
export class GamePlatformController {
  constructor(private readonly gamePlatformService: GamePlatformService) {}

  @Post()
  async assignPlatformToGame(@Body() dto: AddGamePlatformDto) {
    return this.gamePlatformService.linkGameAndPlatform(dto);
  }

  @Get()
  async getAll() {
    return this.gamePlatformService.getAllGamePlatforms();
  }

  @Delete('game/:gameId/platform/:platformId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePlatformFromGame(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Param('platformId', ParseIntPipe) platformId: number,
  ) {
    return this.gamePlatformService.unlinkGameAndPlatform(gameId, platformId);
  }

  @Get('game/:gameId')
  async getPlatformsForGame(@Param('gameId', ParseIntPipe) gameId: number) {
    return this.gamePlatformService.getPlatformsByGame(gameId);
  }

  @Get('platform/:platformId')
  async getGamesForPlatform(@Param('platformId', ParseIntPipe) platformId: number) {
    return this.gamePlatformService.getGamesByPlatform(platformId);
  }
}
