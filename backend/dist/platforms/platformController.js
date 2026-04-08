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
exports.PlatformController = void 0;
const common_1 = require("@nestjs/common");
const platformService_1 = require("./platformService");
const platformDto_1 = require("./platformDto");
let PlatformController = class PlatformController {
    constructor(platformService) {
        this.platformService = platformService;
    }
    async getAll() {
        return this.platformService.getAllPlatforms();
    }
    async getOneByName(name) {
        return this.platformService.getPlatformByName(name);
    }
    async getOne(id) {
        return this.platformService.getPlatformById(id);
    }
    async create(createDto) {
        return this.platformService.createPlatform(createDto);
    }
    async update(id, updateDto) {
        return this.platformService.updatePlatform(id, updateDto);
    }
    async delete(id) {
        return this.platformService.deletePlatform(id);
    }
};
exports.PlatformController = PlatformController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('name/:name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "getOneByName", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [platformDto_1.CreatePlatformDto]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, platformDto_1.UpdatePlatformDto]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "delete", null);
exports.PlatformController = PlatformController = __decorate([
    (0, common_1.Controller)('platforms'),
    __metadata("design:paramtypes", [platformService_1.PlatformService])
], PlatformController);
//# sourceMappingURL=platformController.js.map