import { UsersService } from '../users/userService';
import { GameService } from '../games/gameService';
import { CategoryService } from '../categories/categoryService';
import { PlatformService } from '../platforms/platformService';
import { CreateUserDto, UpdateUserDto } from '../users/userDto';
import { CreateGameDto, UpdateGameDto } from '../games/gameDto';
export declare class AdminController {
    private readonly usersService;
    private readonly gameService;
    private readonly categoryService;
    private readonly platformService;
    constructor(usersService: UsersService, gameService: GameService, categoryService: CategoryService, platformService: PlatformService);
    getDashboardSummary(): Promise<{
        totalUsers: number;
        totalAdmins: number;
        totalCustomers: number;
        totalGames: number;
        totalCategories: number;
        totalPlatforms: number;
    }>;
    getAllUsers(): Promise<Partial<import("../users/userEntity").User>[]>;
    getUser(id: string): Promise<Omit<import("../users/userEntity").User, "password" | "totpSecret" | "refreshToken" | "passwordResetToken" | "passwordResetExpires" | "passwordResetMethod" | "passwordResetAttempts"> | null>;
    createUser(createDto: CreateUserDto): Promise<Omit<import("../users/userEntity").User, "password" | "totpSecret" | "refreshToken" | "passwordResetToken" | "passwordResetExpires" | "passwordResetMethod" | "passwordResetAttempts">>;
    updateUser(id: string, updateDto: UpdateUserDto): Promise<Omit<import("../users/userEntity").User, "password" | "totpSecret" | "refreshToken" | "passwordResetToken" | "passwordResetExpires" | "passwordResetMethod" | "passwordResetAttempts">>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    getAllGames(): Promise<import("../games/gameEntity").Game[]>;
    getGame(id: string): Promise<import("../games/gameEntity").Game>;
    createGame(createDto: CreateGameDto): Promise<import("../games/gameEntity").Game>;
    updateGame(id: string, updateDto: UpdateGameDto): Promise<import("../games/gameEntity").Game>;
    deleteGame(id: string): Promise<void>;
}
