import { GameCategoryRepository } from './gameCategoryRepository';
import { GameService } from '../games/gameService';
import { CategoryService } from '../categories/categoryService';
import { AddGameCategoryDto } from './gameCategoryDto';
import { GameCategory } from './gameCategoryEntity';
export declare class GameCategoryService {
    private readonly gameCategoryRepository;
    private readonly gameService;
    private readonly categoryService;
    constructor(gameCategoryRepository: GameCategoryRepository, gameService: GameService, categoryService: CategoryService);
    linkGameAndCategory(dto: AddGameCategoryDto): Promise<GameCategory>;
    unlinkGameAndCategory(gameId: number, categoryId: number): Promise<void>;
    getCategoriesByGame(gameId: number): Promise<import("../categories/categoryEntity").Category[]>;
    getGamesByCategory(categoryId: number): Promise<import("../games/gameEntity").Game[]>;
}
