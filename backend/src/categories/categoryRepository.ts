import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categoryEntity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.repository.find();
  }

  async findById(categoryId: number): Promise<Category | null> {
    return this.repository.findOne({ where: { categoryId } });
  }

  async findByName(categoryName: string): Promise<Category | null> {
    return this.repository.findOne({ where: { categoryName } });
  }

  async create(categoryName: string): Promise<Category> {
    const category = this.repository.create({ categoryName });
    return this.repository.save(category);
  }

  async update(categoryId: number, categoryName: string): Promise<Category | null> {
    await this.repository.update(categoryId, { categoryName });
    return this.findById(categoryId);
  }

  async remove(categoryId: number): Promise<void> {
    await this.repository.delete(categoryId);
  }
}
