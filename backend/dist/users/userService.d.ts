import { Repository } from 'typeorm';
import { User, PasswordResetMethod } from './userEntity';
import { CreateUserDto, UpdateUserDto, UpdateUserSettingsDto } from './userDto';
import { RegisterDto } from '../auth/dto/register';
export declare class UsersService {
    private readonly usersRepository;
    private static readonly SALT_ROUNDS;
    constructor(usersRepository: Repository<User>);
    create(dto: CreateUserDto): Promise<User>;
    createPublicUser(dto: RegisterDto): Promise<User>;
    findAll(): Promise<Partial<User>[]>;
    findById(userId: string): Promise<User | null>;
    findSafeById(userId: string): Promise<Partial<User> | null>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByResetToken(hashedToken: string, method?: PasswordResetMethod): Promise<User | null>;
    update(userId: string, dto: UpdateUserDto | Partial<User>, options?: {
        allowRoleChange?: boolean;
    }): Promise<User>;
    updateUserSettings(userId: string, dto: UpdateUserSettingsDto, actorUserId?: string): Promise<Partial<User>>;
    remove(userId: string): Promise<void>;
    setRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
    clearRefreshToken(userId: string): Promise<void>;
    storePasswordResetToken(userId: string, hashedToken: string, expiresAt: Date, method: PasswordResetMethod): Promise<void>;
    incrementPasswordResetAttempts(userId: string): Promise<void>;
    clearPasswordResetState(userId: string): Promise<void>;
    sanitizeUser(user: User): Omit<User, 'password' | 'refreshToken' | 'totpSecret' | 'passwordResetToken' | 'passwordResetExpires' | 'passwordResetMethod' | 'passwordResetAttempts'>;
    private ensureEmailAvailable;
    private ensureUsernameAvailable;
    private normalizeEmail;
    private normalizeUsername;
    private normalizeRequiredString;
    private normalizeOptionalString;
    private parseDateOfBirth;
}
