import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { GameService } from './gameService';
import { CreateGameDto, UpdateGameDto } from './gameDto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getAll(@Query('title') title?: string) {
    if (title) {

        return this.gameService.getGamesByTitle(title);
    }
    return this.gameService.getAllGames();
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.gameService.getGameById(id);
  }

  @Post()
  async create(@Body() createDto: CreateGameDto) {
    return this.gameService.createGame(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateGameDto,
  ) {
    return this.gameService.updateGame(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.gameService.deleteGame(id);
  }
}