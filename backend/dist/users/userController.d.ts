import { UsersService } from './userService';
import { CreateUserDto } from './userDto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<Partial<import("./userEntity").User>[]>;
    create(dto: CreateUserDto): Promise<Omit<import("./userEntity").User, "password" | "totpSecret" | "refreshToken" | "passwordResetToken" | "passwordResetExpires" | "passwordResetMethod" | "passwordResetAttempts">>;
}
