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
            userId: string;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            country: string;
            dateOfBirth: string;
            role: import("../users/userEntity").UserRole;
            isEmailVerified: boolean;
            isTotpEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(user: User): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            userId: string;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            country: string;
            dateOfBirth: string;
            role: import("../users/userEntity").UserRole;
            isEmailVerified: boolean;
            isTotpEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        requiresTwoFactor?: undefined;
        tempToken?: undefined;
        otpMethod?: undefined;
    } | {
        requiresTwoFactor: boolean;
        tempToken: string;
        otpMethod: TwoFactorMethod;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            userId: string;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            country: string;
            dateOfBirth: string;
            role: import("../users/userEntity").UserRole;
            isEmailVerified: boolean;
            isTotpEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    decodeRefreshToken(token: string): {
        sub: string;
        email: string;
        role?: string;
    };
    logout(userId: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<import("./resetPassword/reset-password.types").PasswordResetRequestResult>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    generateTotpSecret(userId: string): Promise<{
        secret: string;
        qrCode: string;
    }>;
    enableTotp(userId: string, code: string): Promise<{
        message: string;
    }>;
    verifyTotpAndLogin(tempToken: string, code: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            userId: string;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            country: string;
            dateOfBirth: string;
            role: import("../users/userEntity").UserRole;
            isEmailVerified: boolean;
            isTotpEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    disableTotp(userId: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private sanitizeUser;
    private storePendingLoginOtp;
    private verifyPendingLoginOtp;
    private cleanupExpiredPendingOtps;
    private generateNumericOtp;
    private sendLoginOtp;
    private isEmailOtpLoginEnabled;
}
export {};
