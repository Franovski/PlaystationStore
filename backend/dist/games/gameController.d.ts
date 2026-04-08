import { GameService } from './gameService';
import { CreateGameDto, UpdateGameDto } from './gameDto';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    getAll(title?: string): Promise<import("./gameEntity").Game[]>;
    getOne(id: number): Promise<import("./gameEntity").Game>;
    create(createDto: CreateGameDto): Promise<import("./gameEntity").Game>;
    update(id: number, updateDto: UpdateGameDto): Promise<import("./gameEntity").Game>;
    delete(id: number): Promise<void>;
}
