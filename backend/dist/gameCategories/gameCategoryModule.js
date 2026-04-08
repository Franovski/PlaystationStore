"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameCategoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const gameCategoryEntity_1 = require("./gameCategoryEntity");
const gameCategoryController_1 = require("./gameCategoryController");
const gameCategoryService_1 = require("./gameCategoryService");
const gameCategoryRepository_1 = require("./gameCategoryRepository");
const gameModule_1 = require("../games/gameModule");
const categoryModule_1 = require("../categories/categoryModule");
let GameCategoryModule = class GameCategoryModule {
};
exports.GameCategoryModule = GameCategoryModule;
exports.GameCategoryModule = GameCategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([gameCategoryEntity_1.GameCategory]),
            gameModule_1.GameModule,
            categoryModule_1.CategoryModule,
        ],
        controllers: [gameCategoryController_1.GameCategoryController],
        providers: [gameCategoryService_1.GameCategoryService, gameCategoryRepository_1.GameCategoryRepository],
        exports: [gameCategoryService_1.GameCategoryService],
    })
], GameCategoryModule);
//# sourceMappingURL=gameCategoryModule.js.map