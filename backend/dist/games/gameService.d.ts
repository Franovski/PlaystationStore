import { GameRepository } from './gameRepository';
import { CreateGameDto, UpdateGameDto } from './gameDto';
import { Game } from './gameEntity';
export declare class GameService {
    private readonly gameRepository;
    constructor(gameRepository: GameRepository);
    getAllGames(): Promise<Game[]>;
    getGameById(id: number): Promise<Game>;
    getGamesByTitle(title: string): Promise<Game[]>;
    createGame(createDto: CreateGameDto): Promise<Game>;
    updateGame(id: number, updateDto: UpdateGameDto): Promise<Game>;
    deleteGame(id: number): Promise<void>;
}
