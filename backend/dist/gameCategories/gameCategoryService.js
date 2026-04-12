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
exports.GameCategoryService = void 0;
const common_1 = require("@nestjs/common");
const gameCategoryRepository_1 = require("./gameCategoryRepository");
const gameService_1 = require("../games/gameService");
const categoryService_1 = require("../categories/categoryService");
let GameCategoryService = class GameCategoryService {
    constructor(gameCategoryRepository, gameService, categoryService) {
        this.gameCategoryRepository = gameCategoryRepository;
        this.gameService = gameService;
        this.categoryService = categoryService;
    }
    async linkGameAndCategory(dto) {
        await this.gameService.getGameById(dto.gameId);
        await this.categoryService.getCategoryById(dto.categoryId);
        const existing = await this.gameCategoryRepository.checkLink(dto.gameId, dto.categoryId);
        if (existing) {
            throw new common_1.ConflictException(`Game ID ${dto.gameId} is already linked with Category ID ${dto.categoryId}`);
        }
        return this.gameCategoryRepository.link(dto.gameId, dto.categoryId);
    }
    async unlinkGameAndCategory(gameId, categoryId) {
        const existing = await this.gameCategoryRepository.checkLink(gameId, categoryId);
        if (!existing) {
            throw new common_1.NotFoundException(`Link between Game ID ${gameId} and Category ID ${categoryId} not found`);
        }
        await this.gameCategoryRepository.unlink(gameId, categoryId);
    }
    async getCategoriesByGame(gameId) {
        await this.gameService.getGameById(gameId);
        const mappings = await this.gameCategoryRepository.findByGame(gameId);
        return mappings.map((mapping) => mapping.category);
    }
    async getAllGameCategories() {
        return this.gameCategoryRepository.findAll();
    }
    async getGamesByCategory(categoryId) {
        await this.categoryService.getCategoryById(categoryId);
        const mappings = await this.gameCategoryRepository.findByCategory(categoryId);
        return mappings.map((mapping) => mapping.game);
    }
};
exports.GameCategoryService = GameCategoryService;
exports.GameCategoryService = GameCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gameCategoryRepository_1.GameCategoryRepository,
        gameService_1.GameService,
        categoryService_1.CategoryService])
], GameCategoryService);
//# sourceMappingURL=gameCategoryService.js.map