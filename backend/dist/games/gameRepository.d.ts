import { Repository } from 'typeorm';
import { Game } from './gameEntity';
import { CreateGameDto, UpdateGameDto } from './gameDto';
export declare class GameRepository {
    private readonly repository;
    constructor(repository: Repository<Game>);
    findAll(): Promise<Game[]>;
    findById(gameId: number): Promise<Game | null>;
    findByTitle(title: string): Promise<Game[]>;
    create(createDto: CreateGameDto): Promise<Game>;
    update(gameId: number, updateData: UpdateGameDto): Promise<Game | null>;
    remove(gameId: number): Promise<void>;
}
