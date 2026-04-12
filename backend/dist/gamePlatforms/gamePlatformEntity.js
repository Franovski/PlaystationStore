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
exports.GamePlatform = void 0;
const typeorm_1 = require("typeorm");
const gameEntity_1 = require("../games/gameEntity");
const platformEntity_1 = require("../platforms/platformEntity");
let GamePlatform = class GamePlatform {
};
exports.GamePlatform = GamePlatform;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'game_id' }),
    __metadata("design:type", Number)
], GamePlatform.prototype, "gameId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'platform_id' }),
    __metadata("design:type", Number)
], GamePlatform.prototype, "platformId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => gameEntity_1.Game, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'game_id' }),
    __metadata("design:type", gameEntity_1.Game)
], GamePlatform.prototype, "game", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => platformEntity_1.Platform, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'platform_id' }),
    __metadata("design:type", platformEntity_1.Platform)
], GamePlatform.prototype, "platform", void 0);
exports.GamePlatform = GamePlatform = __decorate([
    (0, typeorm_1.Entity)('game_platforms')
], GamePlatform);
//# sourceMappingURL=gamePlatformEntity.js.map