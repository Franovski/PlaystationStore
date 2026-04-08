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
exports.PlatformService = void 0;
const common_1 = require("@nestjs/common");
const platformRepository_1 = require("./platformRepository");
let PlatformService = class PlatformService {
    constructor(platformRepository) {
        this.platformRepository = platformRepository;
    }
    async getAllPlatforms() {
        return this.platformRepository.findAll();
    }
    async getPlatformById(id) {
        const platform = await this.platformRepository.findById(id);
        if (!platform) {
            throw new common_1.NotFoundException(`Platform with ID ${id} not found`);
        }
        return platform;
    }
    async getPlatformByName(name) {
        const platform = await this.platformRepository.findByName(name);
        if (!platform) {
            throw new common_1.NotFoundException(`Platform with name '${name}' not found`);
        }
        return platform;
    }
    async createPlatform(createDto) {
        const existing = await this.platformRepository.findByName(createDto.platformName);
        if (existing) {
            throw new common_1.ConflictException(`Platform with name '${createDto.platformName}' already exists`);
        }
        return this.platformRepository.create(createDto.platformName);
    }
    async updatePlatform(id, updateDto) {
        if (!updateDto.platformName) {
            return this.getPlatformById(id);
        }
        await this.getPlatformById(id);
        const existing = await this.platformRepository.findByName(updateDto.platformName);
        if (existing && existing.platformId !== id) {
            throw new common_1.ConflictException(`Platform with name '${updateDto.platformName}' already exists`);
        }
        const platform = await this.platformRepository.update(id, updateDto.platformName);
        if (!platform) {
            throw new common_1.NotFoundException(`Platform with ID ${id} not found`);
        }
        return platform;
    }
    async deletePlatform(id) {
        const platform = await this.platformRepository.findById(id);
        if (!platform) {
            throw new common_1.NotFoundException(`Platform with ID ${id} not found`);
        }
        await this.platformRepository.remove(id);
    }
};
exports.PlatformService = PlatformService;
exports.PlatformService = PlatformService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [platformRepository_1.PlatformRepository])
], PlatformService);
//# sourceMappingURL=platformService.js.map