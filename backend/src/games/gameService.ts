import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { GameRepository } from './gameRepository';
import { CreateGameDto, UpdateGameDto } from './gameDto';
import { Game } from './gameEntity';

@Injectable()
export class GameService {
  constructor(private readonly gameRepository: GameRepository) {}

  async getAllGames(): Promise<Game[]> {
    return this.gameRepository.findAll();
  }

  async getGameById(id: number): Promise<Game> {
    const game = await this.gameRepository.findById(id);
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    return game;
  }

  async getGamesByTitle(title: string): Promise<Game[]> {
    const games = await this.gameRepository.findByTitle(title);
    if (!games || games.length === 0) {
      throw new NotFoundException(`No games found with title '${title}'`);
    }
    return games;
  }

  async createGame(createDto: CreateGameDto): Promise<Game> {

    if (createDto.basePrice < 0) {
      throw new BadRequestException('Game basePrice cannot be negative');
    }

    if (createDto.title.trim().length === 0) {
      throw new BadRequestException('Game title cannot be empty');
    }

    if (createDto.releaseDate) {
      const releaseDate = new Date(createDto.releaseDate);
      if (releaseDate <= new Date()) {
        throw new BadRequestException('Game release date must be in the future');
      }
    }

    return this.gameRepository.create(createDto);
  }

  async updateGame(id: number, updateDto: UpdateGameDto): Promise<Game> {

    await this.getGameById(id);

    if (updateDto.basePrice !== undefined && updateDto.basePrice < 0) {
        throw new BadRequestException('Game basePrice cannot be negative');
    }

    if (updateDto.title !== undefined && updateDto.title.trim().length === 0) {
      throw new BadRequestException('Game title cannot be empty');
    }

    if (updateDto.releaseDate) {
      const releaseDate = new Date(updateDto.releaseDate);
      if (releaseDate <= new Date()) {
        throw new BadRequestException('Game release date must be in the future');
      }
    }

    if (Object.keys(updateDto).length === 0) {
      return this.getGameById(id);
    }

    const game = await this.gameRepository.update(id, updateDto);
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found after update attempt`);
    }
    return game;
  }

  async deleteGame(id: number): Promise<void> {

    const game = await this.gameRepository.findById(id);
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    await this.gameRepository.remove(id);
  }
}