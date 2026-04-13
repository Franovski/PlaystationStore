import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CategoryRepository } from './categoryRepository';
import { CreateCategoryDto, UpdateCategoryDto } from './categoryDto';
import { Category } from './categoryEntity';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async getCategoryByName(name: string): Promise<Category> {
    const category = await this.categoryRepository.findByName(name);
    if (!category) {
      throw new NotFoundException(`Category with name '${name}' not found`);
    }
    return category;
  }

  async createCategory(createDto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepository.findByName(createDto.categoryName);
    if (existing) {
      throw new ConflictException(`Category with name '${createDto.categoryName}' already exists`);
    }
    return this.categoryRepository.create(createDto.categoryName);
  }

  async updateCategory(id: number, updateDto: UpdateCategoryDto): Promise<Category> {
    if (!updateDto.categoryName) {
        return this.getCategoryById(id);
    }

    await this.getCategoryById(id);

    const existing = await this.categoryRepository.findByName(updateDto.categoryName);
    if (existing && existing.categoryId !== id) {
      throw new ConflictException(`Category with name '${updateDto.categoryName}' already exists`);
    }

    const category = await this.categoryRepository.update(id, updateDto.categoryName);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    await this.categoryRepository.remove(id);
  }
}
