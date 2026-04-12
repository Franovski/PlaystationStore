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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const userService_1 = require("../users/userService");
const gameService_1 = require("../games/gameService");
const categoryService_1 = require("../categories/categoryService");
const platformService_1 = require("../platforms/platformService");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const rolesGuard_1 = require("../auth/guards/rolesGuard");
const roleDecorator_1 = require("../auth/decorators/roleDecorator");
const userEntity_1 = require("../users/userEntity");
const userDto_1 = require("../users/userDto");
const gameDto_1 = require("../games/gameDto");
let AdminController = class AdminController {
    constructor(usersService, gameService, categoryService, platformService) {
        this.usersService = usersService;
        this.gameService = gameService;
        this.categoryService = categoryService;
        this.platformService = platformService;
    }
    async getDashboardSummary() {
        const users = await this.usersService.findAll();
        const games = await this.gameService.getAllGames();
        const categories = await this.categoryService.getAllCategories();
        const platforms = await this.platformService.getAllPlatforms();
        return {
            totalUsers: users.length,
            totalAdmins: users.filter((u) => u.role === userEntity_1.UserRole.ADMIN).length,
            totalCustomers: users.filter((u) => u.role === userEntity_1.UserRole.PLAYSTATION_USER).length,
            totalGames: games.length,
            totalCategories: categories.length,
            totalPlatforms: platforms.length,
        };
    }
    async getAllUsers() {
        return this.usersService.findAll();
    }
    async getUser(id) {
        const user = await this.usersService.findById(id);
        return user ? this.usersService.sanitizeUser(user) : null;
    }
    async createUser(createDto) {
        const user = await this.usersService.create(createDto);
        return this.usersService.sanitizeUser(user);
    }
    async updateUser(id, updateDto) {
        const user = await this.usersService.update(id, updateDto, {
            allowRoleChange: true,
        });
        return this.usersService.sanitizeUser(user);
    }
    async deleteUser(id) {
        await this.usersService.remove(id);
        return { message: 'User deleted successfully' };
    }
    async getAllGames() {
        return this.gameService.getAllGames();
    }
    async getGame(id) {
        return this.gameService.getGameById(+id);
    }
    async createGame(createDto) {
        return this.gameService.createGame(createDto);
    }
    async updateGame(id, updateDto) {
        return this.gameService.updateGame(+id, updateDto);
    }
    async deleteGame(id) {
        return this.gameService.deleteGame(+id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard/summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardSummary", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUser", null);
__decorate([
    (0, common_1.Post)('users'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userDto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Patch)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, userDto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('games'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllGames", null);
__decorate([
    (0, common_1.Get)('games/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getGame", null);
__decorate([
    (0, common_1.Post)('games'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gameDto_1.CreateGameDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createGame", null);
__decorate([
    (0, common_1.Patch)('games/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gameDto_1.UpdateGameDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateGame", null);
__decorate([
    (0, common_1.Delete)('games/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteGame", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rolesGuard_1.RolesGuard),
    (0, roleDecorator_1.Roles)(userEntity_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [userService_1.UsersService,
        gameService_1.GameService,
        categoryService_1.CategoryService,
        platformService_1.PlatformService])
], AdminController);
//# sourceMappingURL=adminController.js.map