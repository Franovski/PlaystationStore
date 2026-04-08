"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const gameEntity_1 = require("./gameEntity");
const gameController_1 = require("./gameController");
const gameService_1 = require("./gameService");
const gameRepository_1 = require("./gameRepository");
let GameModule = class GameModule {
};
exports.GameModule = GameModule;
exports.GameModule = GameModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([gameEntity_1.Game])],
        controllers: [gameController_1.GameController],
        providers: [gameService_1.GameService, gameRepository_1.GameRepository],
        exports: [gameService_1.GameService, gameRepository_1.GameRepository],
    })
], GameModule);
//# sourceMappingURL=gameModule.js.map