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
exports.UpdatePlatformDto = exports.CreatePlatformDto = void 0;
const class_validator_1 = require("class-validator");
const platformEntity_1 = require("./platformEntity");
class CreatePlatformDto {
}
exports.CreatePlatformDto = CreatePlatformDto;
__decorate([
    (0, class_validator_1.IsEnum)(platformEntity_1.PlatformName, { message: 'platformName must be either ps4 or ps5' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePlatformDto.prototype, "platformName", void 0);
class UpdatePlatformDto {
}
exports.UpdatePlatformDto = UpdatePlatformDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(platformEntity_1.PlatformName, { message: 'platformName must be either ps4 or ps5' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePlatformDto.prototype, "platformName", void 0);
//# sourceMappingURL=platformDto.js.map