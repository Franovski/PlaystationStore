import { Repository } from 'typeorm';
import { GamePlatform } from './gamePlatformEntity';
export declare class GamePlatformRepository {
    private readonly repository;
    constructor(repository: Repository<GamePlatform>);
    findByGame(gameId: number): Promise<GamePlatform[]>;
    findAll(): Promise<GamePlatform[]>;
    findByPlatform(platformId: number): Promise<GamePlatform[]>;
    checkLink(gameId: number, platformId: number): Promise<GamePlatform | null>;
    link(gameId: number, platformId: number): Promise<GamePlatform>;
    unlink(gameId: number, platformId: number): Promise<void>;
}
