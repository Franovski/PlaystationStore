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
exports.PlatformRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const platformEntity_1 = require("./platformEntity");
let PlatformRepository = class PlatformRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async findAll() {
        return this.repository.find();
    }
    async findById(platformId) {
        return this.repository.findOne({ where: { platformId } });
    }
    async findByName(platformName) {
        return this.repository.findOne({ where: { platformName: platformName } });
    }
    async create(platformName) {
        const platform = this.repository.create({ platformName });
        return this.repository.save(platform);
    }
    async update(platformId, platformName) {
        await this.repository.update(platformId, { platformName });
        return this.findById(platformId);
    }
    async remove(platformId) {
        await this.repository.delete(platformId);
    }
};
exports.PlatformRepository = PlatformRepository;
exports.PlatformRepository = PlatformRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(platformEntity_1.Platform)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PlatformRepository);
//# sourceMappingURL=platformRepository.js.map