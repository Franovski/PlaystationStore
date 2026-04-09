import { Repository } from 'typeorm';
import { User, PasswordResetMethod } from './userEntity';
import { CreateUserDto, UpdateUserDto } from './userDto';
import { RegisterDto } from '../auth/dto/register';
export declare class UsersService {
    private readonly usersRepository;
    private static readonly SALT_ROUNDS;
    constructor(usersRepository: Repository<User>);
    create(dto: CreateUserDto): Promise<User>;
    createPublicUser(dto: RegisterDto): Promise<User>;
    findAll(): Promise<Partial<User>[]>;
    findById(userId: number): Promise<User | null>;
    findSafeById(userId: number): Promise<Partial<User> | null>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByResetToken(hashedToken: string, method?: PasswordResetMethod): Promise<User | null>;
    update(userId: number, dto: UpdateUserDto | Partial<User>, options?: {
        allowRoleChange?: boolean;
    }): Promise<User>;
    remove(userId: number): Promise<void>;
    setRefreshToken(userId: number, refreshToken: string | null): Promise<void>;
    clearRefreshToken(userId: number): Promise<void>;
    storePasswordResetToken(userId: number, hashedToken: string, expiresAt: Date, method: PasswordResetMethod): Promise<void>;
    incrementPasswordResetAttempts(userId: number): Promise<void>;
    clearPasswordResetState(userId: number): Promise<void>;
    sanitizeUser(user: User): Omit<User, 'password' | 'refreshToken' | 'totpSecret' | 'passwordResetToken' | 'passwordResetExpires' | 'passwordResetMethod' | 'passwordResetAttempts'>;
    private ensureEmailAvailable;
    private ensureUsernameAvailable;
    private normalizeEmail;
    private normalizeUsername;
    private normalizeRequiredString;
    private normalizeOptionalString;
    private parseDateOfBirth;
}
