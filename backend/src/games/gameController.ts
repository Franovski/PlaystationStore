/**
 * @file gameController.ts
 * @purpose Handles incoming HTTP requests for the games resource.
 * @overview Defines the HTTP endpoints for CRUD operations on games, including retrieving, creating, updating, and deleting games.
 * @responsibilities Maps HTTP routes to the corresponding business logic in GameService, handles route parameters, and returns appropriate HTTP responses.
 * @interaction Acts as the entry point for the REST API related to games, injecting GameService to execute the underlying logic.
 */
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { GameService } from './gameService';
import { CreateGameDto, UpdateGameDto } from './gameDto';

/**
 * Controller responsible for managing game-related API endpoints.
 * 
 * @class GameController
 * @description Provides routing mechanisms for game resources, facilitating operations like fetching, creating, updating, and deleting games.
 * Relies on the GameService to process business requirements and interact with the database.
 */
@Controller('games')
export class GameController {
  /**
   * Initializes the GameController with the required game service.
   * 
   * @param {GameService} gameService - The injected service that encapuslates game-related business logic and database interactions.
   */
  constructor(private readonly gameService: GameService) {}

  /**
   * Retrieves a list of games, optionally filtered by title.
   * 
   * @param {string} [title] - An optional query parameter to filter games by a specific title.
   * @returns {Promise<Game[]>} A promise that resolves to an array of games matching the request criteria.
   */
  @Get()
  async getAll(@Query('title') title?: string) {
    // If a title query parameter is provided, perform a search based on that title.
    if (title) {
        return this.gameService.getGamesByTitle(title);
    }
    // Otherwise, return all games present in the system.
    return this.gameService.getAllGames();
  }

  /**
   * Retrieves a single game by its unique identifier.
   * 
   * @param {number} id - The ID of the game parsed as an integer.
   * @returns {Promise<Game>} A promise resolving to the requested game object.
   */
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.gameService.getGameById(id);
  }

  /**
   * Creates a new game record in the system.
   * 
   * @param {CreateGameDto} createDto - The data transfer object containing the necessary details to construct a new game.
   * @returns {Promise<Game>} A promise resolving to the newly created game object.
   */
  @Post()
  async create(@Body() createDto: CreateGameDto) {
    return this.gameService.createGame(createDto);
  }

  /**
   * Updates an existing game record.
   * 
   * @param {number} id - The unique identifier of the game to be updated.
   * @param {UpdateGameDto} updateDto - The data transfer object containing the fields to update.
   * @returns {Promise<Game>} A promise resolving to the updated game entity.
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateGameDto,
  ) {
    return this.gameService.updateGame(id, updateDto);
  }

  /**
   * Deletes a game by its ID.
   * 
   * @param {number} id - The unique identifier of the game to remove.
   * @returns {Promise<void>} A promise resolving successfully upon deletion, returning a 204 No Content response.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.gameService.deleteGame(id);
  }
}