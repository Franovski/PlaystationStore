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
exports.GameCategoryController = void 0;
const common_1 = require("@nestjs/common");
const gameCategoryService_1 = require("./gameCategoryService");
const gameCategoryDto_1 = require("./gameCategoryDto");
let GameCategoryController = class GameCategoryController {
    constructor(gameCategoryService) {
        this.gameCategoryService = gameCategoryService;
    }
    async assignCategoryToGame(dto) {
        return this.gameCategoryService.linkGameAndCategory(dto);
    }
    async getAll() {
        return this.gameCategoryService.getAllGameCategories();
    }
    async removeCategoryFromGame(gameId, categoryId) {
        return this.gameCategoryService.unlinkGameAndCategory(gameId, categoryId);
    }
    async getCategoriesForGame(gameId) {
        return this.gameCategoryService.getCategoriesByGame(gameId);
    }
    async getGamesForCategory(categoryId) {
        return this.gameCategoryService.getGamesByCategory(categoryId);
    }
};
exports.GameCategoryController = GameCategoryController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gameCategoryDto_1.AddGameCategoryDto]),
    __metadata("design:returntype", Promise)
], GameCategoryController.prototype, "assignCategoryToGame", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GameCategoryController.prototype, "getAll", null);
__decorate([
    (0, common_1.Delete)('game/:gameId/category/:categoryId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('gameId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], GameCategoryController.prototype, "removeCategoryFromGame", null);
__decorate([
    (0, common_1.Get)('game/:gameId'),
    __param(0, (0, common_1.Param)('gameId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GameCategoryController.prototype, "getCategoriesForGame", null);
__decorate([
    (0, common_1.Get)('category/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GameCategoryController.prototype, "getGamesForCategory", null);
exports.GameCategoryController = GameCategoryController = __decorate([
    (0, common_1.Controller)('game-categories'),
    __metadata("design:paramtypes", [gameCategoryService_1.GameCategoryService])
], GameCategoryController);
//# sourceMappingURL=gameCategoryController.js.map