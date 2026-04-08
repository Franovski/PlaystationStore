import { Repository } from 'typeorm';
import { Category } from './categoryEntity';
export declare class CategoryRepository {
    private readonly repository;
    constructor(repository: Repository<Category>);
    findAll(): Promise<Category[]>;
    findById(categoryId: number): Promise<Category | null>;
    findByName(categoryName: string): Promise<Category | null>;
    create(categoryName: string): Promise<Category>;
    update(categoryId: number, categoryName: string): Promise<Category | null>;
    remove(categoryId: number): Promise<void>;
}
