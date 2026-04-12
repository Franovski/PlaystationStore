import { Repository } from 'typeorm';
import { GameCategory } from './gameCategoryEntity';
export declare class GameCategoryRepository {
    private readonly repository;
    constructor(repository: Repository<GameCategory>);
    findByGame(gameId: number): Promise<GameCategory[]>;
    findAll(): Promise<GameCategory[]>;
    findByCategory(categoryId: number): Promise<GameCategory[]>;
    checkLink(gameId: number, categoryId: number): Promise<GameCategory | null>;
    link(gameId: number, categoryId: number): Promise<GameCategory>;
    unlink(gameId: number, categoryId: number): Promise<void>;
}
