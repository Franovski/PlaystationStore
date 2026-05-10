import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DLC } from './dlcEntity';
import { DLCService } from './dlcService';
import { CreateDLCDto, UpdateDLCDto } from './dlcDto';

@Resolver(() => DLC)
export class DLCResolver {
  constructor(private readonly service: DLCService) {}

  @Query(() => [DLC])
  async dlcs(
    @Args('name', { type: () => String, nullable: true }) name?: string,
    @Args('gameId', { type: () => Int, nullable: true }) gameId?: number,
  ) {
    if (name) {
      return this.service.getDLCsByName(name);
    }

    if (gameId) {
      return this.service.getDLCsByGameId(gameId);
    }

    return this.service.getAllDLCs();
  }

  @Query(() => [DLC])
  async dlcsWithGames() {
    return this.service.getAllDLCsWithGames();
  }

  @Query(() => DLC)
  async dlc(@Args('id', { type: () => Int }) id: number) {
    return this.service.getDLCById(id);
  }

  @Query(() => DLC)
  async dlcWithGame(@Args('id', { type: () => Int }) id: number) {
    return this.service.getDLCByIdWithGame(id);
  }

  @Mutation(() => DLC)
  async createDLC(@Args('createDLCInput') createDLCInput: CreateDLCDto) {
    return this.service.createDLC(createDLCInput);
  }

  @Mutation(() => DLC)
  async updateDLC(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateDLCInput') updateDLCInput: UpdateDLCDto,
  ) {
    return this.service.updateDLC(id, updateDLCInput);
  }

  @Mutation(() => Boolean)
  async deleteDLC(@Args('id', { type: () => Int }) id: number) {
    await this.service.deleteDLC(id);
    return true;
  }
}
