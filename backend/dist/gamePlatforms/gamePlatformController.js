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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamePlatformController = void 0;
const common_1 = require("@nestjs/common");
const gamePlatformService_1 = require("./gamePlatformService");
const gamePlatformDto_1 = require("./gamePlatformDto");
let GamePlatformController = class GamePlatformController {
    constructor(gamePlatformService) {
        this.gamePlatformService = gamePlatformService;
    }
    async assignPlatformToGame(dto) {
        return this.gamePlatformService.linkGameAndPlatform(dto);
    }
    async getAll() {
        return this.gamePlatformService.getAllGamePlatforms();
    }
    async removePlatformFromGame(gameId, platformId) {
        return this.gamePlatformService.unlinkGameAndPlatform(gameId, platformId);
    }
    async getPlatformsForGame(gameId) {
        return this.gamePlatformService.getPlatformsByGame(gameId);
    }
    async getGamesForPlatform(platformId) {
        return this.gamePlatformService.getGamesByPlatform(platformId);
    }
};
exports.GamePlatformController = GamePlatformController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gamePlatformDto_1.AddGamePlatformDto]),
    __metadata("design:returntype", Promise)
], GamePlatformController.prototype, "assignPlatformToGame", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GamePlatformController.prototype, "getAll", null);
__decorate([
    (0, common_1.Delete)('game/:gameId/platform/:platformId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('gameId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('platformId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], GamePlatformController.prototype, "removePlatformFromGame", null);
__decorate([
    (0, common_1.Get)('game/:gameId'),
    __param(0, (0, common_1.Param)('gameId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GamePlatformController.prototype, "getPlatformsForGame", null);
__decorate([
    (0, common_1.Get)('platform/:platformId'),
    __param(0, (0, common_1.Param)('platformId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GamePlatformController.prototype, "getGamesForPlatform", null);
exports.GamePlatformController = GamePlatformController = __decorate([
    (0, common_1.Controller)('game-platforms'),
    __metadata("design:paramtypes", [gamePlatformService_1.GamePlatformService])
], GamePlatformController);
//# sourceMappingURL=gamePlatformController.js.map