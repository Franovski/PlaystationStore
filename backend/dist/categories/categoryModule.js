"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const categoryEntity_1 = require("./categoryEntity");
const categoryController_1 = require("./categoryController");
const categoryService_1 = require("./categoryService");
const categoryRepository_1 = require("./categoryRepository");
let CategoryModule = class CategoryModule {
};
exports.CategoryModule = CategoryModule;
exports.CategoryModule = CategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([categoryEntity_1.Category])],
        controllers: [categoryController_1.CategoryController],
        providers: [categoryService_1.CategoryService, categoryRepository_1.CategoryRepository],
        exports: [categoryService_1.CategoryService],
    })
], CategoryModule);
//# sourceMappingURL=categoryModule.js.map