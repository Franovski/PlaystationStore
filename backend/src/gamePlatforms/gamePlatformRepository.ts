import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GamePlatform } from './gamePlatformEntity';

@Injectable()
export class GamePlatformRepository {
  constructor(
    @InjectRepository(GamePlatform)
    private readonly repository: Repository<GamePlatform>,
  ) {}

  async findByGame(gameId: number): Promise<GamePlatform[]> {
    return this.repository.find({
      where: { gameId },
      relations: ['platform'],
    });
  }

  async findAll(): Promise<GamePlatform[]> {
    return this.repository.find({
      relations: ['game', 'platform'],
    });
  }

  async findByPlatform(platformId: number): Promise<GamePlatform[]> {
    return this.repository.find({
      where: { platformId },
      relations: ['game'],
    });
  }

  async checkLink(gameId: number, platformId: number): Promise<GamePlatform | null> {
    return this.repository.findOne({ where: { gameId, platformId } });
  }

  async link(gameId: number, platformId: number): Promise<GamePlatform> {
    const link = this.repository.create({ gameId, platformId });
    return this.repository.save(link);
  }

  async unlink(gameId: number, platformId: number): Promise<void> {
    await this.repository.delete({ gameId, platformId });
  }
}
