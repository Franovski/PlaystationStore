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
exports.GameRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gameEntity_1 = require("./gameEntity");
let GameRepository = class GameRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async findAll() {
        return this.repository.find();
    }
    async findById(gameId) {
        return this.repository.findOne({ where: { gameId } });
    }
    async findByTitle(title) {
        return this.repository.find({ where: { title } });
    }
    async create(createDto) {
        const game = this.repository.create(createDto);
        return this.repository.save(game);
    }
    async update(gameId, updateData) {
        await this.repository.update(gameId, updateData);
        return this.findById(gameId);
    }
    async remove(gameId) {
        await this.repository.delete(gameId);
    }
};
exports.GameRepository = GameRepository;
exports.GameRepository = GameRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gameEntity_1.Game)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GameRepository);
//# sourceMappingURL=gameRepository.js.map