import { Game } from '../games/gameEntity';
import { Category } from '../categories/categoryEntity';
export declare class GameCategory {
    gameId: number;
    categoryId: number;
    game: Game;
    category: Category;
}
