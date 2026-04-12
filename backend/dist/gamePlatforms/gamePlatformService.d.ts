import { GamePlatformRepository } from './gamePlatformRepository';
import { GameService } from '../games/gameService';
import { PlatformService } from '../platforms/platformService';
import { AddGamePlatformDto } from './gamePlatformDto';
import { GamePlatform } from './gamePlatformEntity';
export declare class GamePlatformService {
    private readonly gamePlatformRepository;
    private readonly gameService;
    private readonly platformService;
    constructor(gamePlatformRepository: GamePlatformRepository, gameService: GameService, platformService: PlatformService);
    linkGameAndPlatform(dto: AddGamePlatformDto): Promise<GamePlatform>;
    unlinkGameAndPlatform(gameId: number, platformId: number): Promise<void>;
    getPlatformsByGame(gameId: number): Promise<import("../platforms/platformEntity").Platform[]>;
    getAllGamePlatforms(): Promise<GamePlatform[]>;
    getGamesByPlatform(platformId: number): Promise<import("../games/gameEntity").Game[]>;
}
