import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameCategory } from './gameCategoryEntity';

@Injectable()
export class GameCategoryRepository {
  constructor(
    @InjectRepository(GameCategory)
    private readonly repository: Repository<GameCategory>,
  ) {}

  async findByGame(gameId: number): Promise<GameCategory[]> {
    return this.repository.find({
      where: { gameId },
      relations: ['category'],
    });
  }

  async findByCategory(categoryId: number): Promise<GameCategory[]> {
    return this.repository.find({
      where: { categoryId },
      relations: ['game'],
    });
  }

  async checkLink(gameId: number, categoryId: number): Promise<GameCategory | null> {
    return this.repository.findOne({ where: { gameId, categoryId } });
  }

  async link(gameId: number, categoryId: number): Promise<GameCategory> {
    const link = this.repository.create({ gameId, categoryId });
    return this.repository.save(link);
  }

  async unlink(gameId: number, categoryId: number): Promise<void> {
    await this.repository.delete({ gameId, categoryId });
  }
}