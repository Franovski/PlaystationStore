import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './gameEntity';
import { CreateGameDto, UpdateGameDto } from './gameDto';

@Injectable()
export class GameRepository {
  constructor(
    @InjectRepository(Game)
    private readonly repository: Repository<Game>,
  ) {}

  async findAll(): Promise<Game[]> {
    return this.repository.find();
  }

  async findById(gameId: number): Promise<Game | null> {
    return this.repository.findOne({ where: { gameId } });
  }

  async findByTitle(title: string): Promise<Game[]> {
    return this.repository.find({ where: { title } });
  }

  async create(createDto: CreateGameDto): Promise<Game> {
    const game = this.repository.create(createDto);
    return this.repository.save(game);
  }

  async update(gameId: number, updateData: UpdateGameDto): Promise<Game | null> {
    await this.repository.update(gameId, updateData);
    return this.findById(gameId);
  }

  async remove(gameId: number): Promise<void> {
    await this.repository.delete(gameId);
  }
}