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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const gameRepository_1 = require("./gameRepository");
let GameService = class GameService {
    constructor(gameRepository) {
        this.gameRepository = gameRepository;
    }
    async getAllGames() {
        return this.gameRepository.findAll();
    }
    async getGameById(id) {
        const game = await this.gameRepository.findById(id);
        if (!game) {
            throw new common_1.NotFoundException(`Game with ID ${id} not found`);
        }
        return game;
    }
    async getGamesByTitle(title) {
        const games = await this.gameRepository.findByTitle(title);
        if (!games || games.length === 0) {
            throw new common_1.NotFoundException(`No games found with title '${title}'`);
        }
        return games;
    }
    async createGame(createDto) {
        if (createDto.basePrice < 0) {
            throw new common_1.BadRequestException('Game basePrice cannot be negative');
        }
        if (createDto.title.trim().length === 0) {
            throw new common_1.BadRequestException('Game title cannot be empty');
        }
        if (createDto.releaseDate) {
            const releaseDate = new Date(createDto.releaseDate);
            if (releaseDate <= new Date()) {
                throw new common_1.BadRequestException('Game release date must be in the future');
            }
        }
        return this.gameRepository.create(createDto);
    }
    async updateGame(id, updateDto) {
        await this.getGameById(id);
        if (updateDto.basePrice !== undefined && updateDto.basePrice < 0) {
            throw new common_1.BadRequestException('Game basePrice cannot be negative');
        }
        if (updateDto.title !== undefined && updateDto.title.trim().length === 0) {
            throw new common_1.BadRequestException('Game title cannot be empty');
        }
        if (updateDto.releaseDate) {
            const releaseDate = new Date(updateDto.releaseDate);
            if (releaseDate <= new Date()) {
                throw new common_1.BadRequestException('Game release date must be in the future');
            }
        }
        if (Object.keys(updateDto).length === 0) {
            return this.getGameById(id);
        }
        const game = await this.gameRepository.update(id, updateDto);
        if (!game) {
            throw new common_1.NotFoundException(`Game with ID ${id} not found after update attempt`);
        }
        return game;
    }
    async deleteGame(id) {
        const game = await this.gameRepository.findById(id);
        if (!game) {
            throw new common_1.NotFoundException(`Game with ID ${id} not found`);
        }
        await this.gameRepository.remove(id);
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gameRepository_1.GameRepository])
], GameService);
//# sourceMappingURL=gameService.js.map