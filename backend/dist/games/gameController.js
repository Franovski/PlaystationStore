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
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const gameService_1 = require("./gameService");
const gameDto_1 = require("./gameDto");
let GameController = class GameController {
    constructor(gameService) {
        this.gameService = gameService;
    }
    async getAll(title) {
        if (title) {
            return this.gameService.getGamesByTitle(title);
        }
        return this.gameService.getAllGames();
    }
    async getOne(id) {
        return this.gameService.getGameById(id);
    }
    async create(createDto) {
        return this.gameService.createGame(createDto);
    }
    async update(id, updateDto) {
        return this.gameService.updateGame(id, updateDto);
    }
    async delete(id) {
        return this.gameService.deleteGame(id);
    }
};
exports.GameController = GameController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gameDto_1.CreateGameDto]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, gameDto_1.UpdateGameDto]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "delete", null);
exports.GameController = GameController = __decorate([
    (0, common_1.Controller)('games'),
    __metadata("design:paramtypes", [gameService_1.GameService])
], GameController);
//# sourceMappingURL=gameController.js.map