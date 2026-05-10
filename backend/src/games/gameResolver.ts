import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GameService } from './gameService';
import { Game } from './gameEntity';
import { CreateGameDto, UpdateGameDto } from './gameDto';

@Resolver(() => Game)
export class GameResolver {
  constructor(private readonly gameService: GameService) {}

  @Query(() => [Game])
  async games(
    @Args('title', { type: () => String, nullable: true }) title?: string,
  ) {
    if (title) {
      return this.gameService.getGamesByTitle(title);
    }
    return this.gameService.getAllGames();
  }

  @Query(() => Game)
  async game(@Args('id', { type: () => Int }) id: number) {
    return this.gameService.getGameById(id);
  }

  @Mutation(() => Game)
  async createGame(@Args('createGameInput') createGameInput: CreateGameDto) {
    return this.gameService.createGame(createGameInput);
  }

  @Mutation(() => Game)
  async updateGame(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateGameInput') updateGameInput: UpdateGameDto,
  ) {
    return this.gameService.updateGame(id, updateGameInput);
  }

  @Mutation(() => Boolean)
  async deleteGame(@Args('id', { type: () => Int }) id: number) {
    await this.gameService.deleteGame(id);
    return true; // Resolves exactly on success
  }
}
