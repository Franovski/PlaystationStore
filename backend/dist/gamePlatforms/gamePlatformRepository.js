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
exports.GamePlatformRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gamePlatformEntity_1 = require("./gamePlatformEntity");
let GamePlatformRepository = class GamePlatformRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async findByGame(gameId) {
        return this.repository.find({
            where: { gameId },
            relations: ['platform'],
        });
    }
    async findAll() {
        return this.repository.find({
            relations: ['game', 'platform'],
        });
    }
    async findByPlatform(platformId) {
        return this.repository.find({
            where: { platformId },
            relations: ['game'],
        });
    }
    async checkLink(gameId, platformId) {
        return this.repository.findOne({ where: { gameId, platformId } });
    }
    async link(gameId, platformId) {
        const link = this.repository.create({ gameId, platformId });
        return this.repository.save(link);
    }
    async unlink(gameId, platformId) {
        await this.repository.delete({ gameId, platformId });
    }
};
exports.GamePlatformRepository = GamePlatformRepository;
exports.GamePlatformRepository = GamePlatformRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gamePlatformEntity_1.GamePlatform)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GamePlatformRepository);
//# sourceMappingURL=gamePlatformRepository.js.map