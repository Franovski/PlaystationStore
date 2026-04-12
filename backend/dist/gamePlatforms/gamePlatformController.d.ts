import { GamePlatformService } from './gamePlatformService';
import { AddGamePlatformDto } from './gamePlatformDto';
export declare class GamePlatformController {
    private readonly gamePlatformService;
    constructor(gamePlatformService: GamePlatformService);
    assignPlatformToGame(dto: AddGamePlatformDto): Promise<import("./gamePlatformEntity").GamePlatform>;
    getAll(): Promise<import("./gamePlatformEntity").GamePlatform[]>;
    removePlatformFromGame(gameId: number, platformId: number): Promise<void>;
    getPlatformsForGame(gameId: number): Promise<import("../platforms/platformEntity").Platform[]>;
    getGamesForPlatform(platformId: number): Promise<import("../games/gameEntity").Game[]>;
}
