import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { GamePlatformRepository } from './gamePlatformRepository';
import { GameService } from '../games/gameService';
import { PlatformService } from '../platforms/platformService';
import { AddGamePlatformDto } from './gamePlatformDto';
import { GamePlatform } from './gamePlatformEntity';

@Injectable()
export class GamePlatformService {
  constructor(
    private readonly gamePlatformRepository: GamePlatformRepository,
    private readonly gameService: GameService,
    private readonly platformService: PlatformService,
  ) {}

  async linkGameAndPlatform(dto: AddGamePlatformDto): Promise<GamePlatform> {

    await this.gameService.getGameById(dto.gameId);

    await this.platformService.getPlatformById(dto.platformId);

    const existing = await this.gamePlatformRepository.checkLink(dto.gameId, dto.platformId);
    if (existing) {
      throw new ConflictException(`Game ID ${dto.gameId} is already linked with Platform ID ${dto.platformId}`);
    }

    return this.gamePlatformRepository.link(dto.gameId, dto.platformId);
  }

  async unlinkGameAndPlatform(gameId: number, platformId: number): Promise<void> {
    const existing = await this.gamePlatformRepository.checkLink(gameId, platformId);
    if (!existing) {
      throw new NotFoundException(`Link between Game ID ${gameId} and Platform ID ${platformId} not found`);
    }
    await this.gamePlatformRepository.unlink(gameId, platformId);
  }

  async getPlatformsByGame(gameId: number) {

    await this.gameService.getGameById(gameId);

    const mappings = await this.gamePlatformRepository.findByGame(gameId);
    return mappings.map((mapping) => mapping.platform);
  }

  async getAllGamePlatforms(): Promise<GamePlatform[]> {
    return this.gamePlatformRepository.findAll();
  }

  async getGamesByPlatform(platformId: number) {

    await this.platformService.getPlatformById(platformId);

    const mappings = await this.gamePlatformRepository.findByPlatform(platformId);
    return mappings.map((mapping) => mapping.game);
  }
}
