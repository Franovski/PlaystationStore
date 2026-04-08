import { GameCategoryService } from './gameCategoryService';
import { AddGameCategoryDto } from './gameCategoryDto';
export declare class GameCategoryController {
    private readonly gameCategoryService;
    constructor(gameCategoryService: GameCategoryService);
    assignCategoryToGame(dto: AddGameCategoryDto): Promise<import("./gameCategoryEntity").GameCategory>;
    removeCategoryFromGame(gameId: number, categoryId: number): Promise<void>;
    getCategoriesForGame(gameId: number): Promise<import("../categories/categoryEntity").Category[]>;
    getGamesForCategory(categoryId: number): Promise<import("../games/gameEntity").Game[]>;
}
