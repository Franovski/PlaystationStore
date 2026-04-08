import { CategoryService } from './categoryService';
import { CreateCategoryDto, UpdateCategoryDto } from './categoryDto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    getAll(): Promise<import("./categoryEntity").Category[]>;
    getOneByName(name: string): Promise<import("./categoryEntity").Category>;
    getOne(id: number): Promise<import("./categoryEntity").Category>;
    create(createDto: CreateCategoryDto): Promise<import("./categoryEntity").Category>;
    update(id: number, updateDto: UpdateCategoryDto): Promise<import("./categoryEntity").Category>;
    delete(id: number): Promise<void>;
}
