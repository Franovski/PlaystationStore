import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/userService';
import { User } from '../users/userEntity';
import { MailService } from '../mail/mailService';
import { RegisterDto } from './dto/register';
import { PasswordResetService } from './resetPassword/reset-password.service';
import { ResetPasswordDto } from './dto/resetPassword';
type TwoFactorMethod = 'totp' | 'email-otp';
export declare class AuthService {
    private readonly usersService;
    private readonly passwordResetService;
    private readonly jwtService;
    private readonly configService;
    private readonly mailService;
    private static readonly LOGIN_OTP_TTL_MINUTES;
    private readonly pendingLoginOtps;
    constructor(usersService: UsersService, passwordResetService: PasswordResetService, jwtService: JwtService, configService: ConfigService, mailService: MailService);
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
        otpMethod: TwoFactorMethod;
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
    private storePendingLoginOtp;
    private verifyPendingLoginOtp;
    private cleanupExpiredPendingOtps;
    private generateNumericOtp;
    private sendLoginOtp;
}
export {};
