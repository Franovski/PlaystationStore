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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const categoryRepository_1 = require("./categoryRepository");
let CategoryService = class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async getAllCategories() {
        return this.categoryRepository.findAll();
    }
    async getCategoryById(id) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async getCategoryByName(name) {
        const category = await this.categoryRepository.findByName(name);
        if (!category) {
            throw new common_1.NotFoundException(`Category with name '${name}' not found`);
        }
        return category;
    }
    async createCategory(createDto) {
        const existing = await this.categoryRepository.findByName(createDto.categoryName);
        if (existing) {
            throw new common_1.ConflictException(`Category with name '${createDto.categoryName}' already exists`);
        }
        return this.categoryRepository.create(createDto.categoryName);
    }
    async updateCategory(id, updateDto) {
        if (!updateDto.categoryName) {
            return this.getCategoryById(id);
        }
        await this.getCategoryById(id);
        const existing = await this.categoryRepository.findByName(updateDto.categoryName);
        if (existing && existing.categoryId !== id) {
            throw new common_1.ConflictException(`Category with name '${updateDto.categoryName}' already exists`);
        }
        const category = await this.categoryRepository.update(id, updateDto.categoryName);
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async deleteCategory(id) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        await this.categoryRepository.remove(id);
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [categoryRepository_1.CategoryRepository])
], CategoryService);
//# sourceMappingURL=categoryService.js.map