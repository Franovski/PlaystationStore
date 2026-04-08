import { CategoryRepository } from './categoryRepository';
import { CreateCategoryDto, UpdateCategoryDto } from './categoryDto';
import { Category } from './categoryEntity';
export declare class CategoryService {
    private readonly categoryRepository;
    constructor(categoryRepository: CategoryRepository);
    getAllCategories(): Promise<Category[]>;
    getCategoryById(id: number): Promise<Category>;
    getCategoryByName(name: string): Promise<Category>;
    createCategory(createDto: CreateCategoryDto): Promise<Category>;
    updateCategory(id: number, updateDto: UpdateCategoryDto): Promise<Category>;
    deleteCategory(id: number): Promise<void>;
}
