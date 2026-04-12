"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamePlatformService = void 0;
const common_1 = require("@nestjs/common");
const gamePlatformRepository_1 = require("./gamePlatformRepository");
const gameService_1 = require("../games/gameService");
const platformService_1 = require("../platforms/platformService");
let GamePlatformService = class GamePlatformService {
    constructor(gamePlatformRepository, gameService, platformService) {
        this.gamePlatformRepository = gamePlatformRepository;
        this.gameService = gameService;
        this.platformService = platformService;
    }
    async linkGameAndPlatform(dto) {
        await this.gameService.getGameById(dto.gameId);
        await this.platformService.getPlatformById(dto.platformId);
        const existing = await this.gamePlatformRepository.checkLink(dto.gameId, dto.platformId);
        if (existing) {
            throw new common_1.ConflictException(`Game ID ${dto.gameId} is already linked with Platform ID ${dto.platformId}`);
        }
        return this.gamePlatformRepository.link(dto.gameId, dto.platformId);
    }
    async unlinkGameAndPlatform(gameId, platformId) {
        const existing = await this.gamePlatformRepository.checkLink(gameId, platformId);
        if (!existing) {
            throw new common_1.NotFoundException(`Link between Game ID ${gameId} and Platform ID ${platformId} not found`);
        }
        await this.gamePlatformRepository.unlink(gameId, platformId);
    }
    async getPlatformsByGame(gameId) {
        await this.gameService.getGameById(gameId);
        const mappings = await this.gamePlatformRepository.findByGame(gameId);
        return mappings.map((mapping) => mapping.platform);
    }
    async getAllGamePlatforms() {
        return this.gamePlatformRepository.findAll();
    }
    async getGamesByPlatform(platformId) {
        await this.platformService.getPlatformById(platformId);
        const mappings = await this.gamePlatformRepository.findByPlatform(platformId);
        return mappings.map((mapping) => mapping.game);
    }
};
exports.GamePlatformService = GamePlatformService;
exports.GamePlatformService = GamePlatformService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gamePlatformRepository_1.GamePlatformRepository,
        gameService_1.GameService,
        platformService_1.PlatformService])
], GamePlatformService);
//# sourceMappingURL=gamePlatformService.js.map