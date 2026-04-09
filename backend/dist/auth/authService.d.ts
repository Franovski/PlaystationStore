import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/userService';
import { User } from '../users/userEntity';
import { RegisterDto } from './dto/register';
import { PasswordResetService } from './resetPassword/reset-password.service';
import { ResetPasswordDto } from './dto/resetPassword';
export declare class AuthService {
    private readonly usersService;
    private readonly passwordResetService;
    private readonly jwtService;
    private readonly configService;
    constructor(usersService: UsersService, passwordResetService: PasswordResetService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<User | null>;
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            userId: number;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            country: string;
            dateOfBirth: Date;
            role: import("../users/userEntity").UserRole;
            isEmailVerified: boolean;
            isTotpEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(user: User): Promise<{
        requiresTwoFactor: boolean;
        tempToken: string;
    } | {
        accessToken: string;
        refreshToken: string;
        user: {
            userId: number;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            country: string;
            dateOfBirth: Date;
            role: import("../users/userEntity").UserRole;
            isEmailVerified: boolean;
            isTotpEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        requiresTwoFactor?: undefined;
        tempToken?: undefined;
    }>;
    refreshTokens(userId: number, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            userId: number;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            country: string;
            dateOfBirth: Date;
            role: import("../users/userEntity").UserRole;
            isEmailVerified: boolean;
            isTotpEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    decodeRefreshToken(token: string): {
        sub: number;
        email: string;
        role?: string;
    };
    logout(userId: number): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<import("./resetPassword/reset-password.types").PasswordResetRequestResult>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    generateTotpSecret(userId: number): Promise<{
        secret: string;
        qrCode: string;
    }>;
    enableTotp(userId: number, code: string): Promise<{
        message: string;
    }>;
    verifyTotpAndLogin(tempToken: string, code: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            userId: number;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            country: string;
            dateOfBirth: Date;
            role: import("../users/userEntity").UserRole;
            isEmailVerified: boolean;
            isTotpEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    disableTotp(userId: number): Promise<{
        message: string;
    }>;
    private generateTokens;
    private sanitizeUser;
}
