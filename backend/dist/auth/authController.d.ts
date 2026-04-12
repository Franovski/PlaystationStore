import { AuthService } from './authService';
import { RegisterDto } from './dto/register';
import { LoginDto } from './dto/login';
import { ResetPasswordDto } from './dto/resetPassword';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(dto: LoginDto): Promise<{
        requiresTwoFactor: boolean;
        tempToken: string;
        otpMethod: "totp" | "email-otp";
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
    logout(req: any): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<import("./resetPassword/reset-password.types").PasswordResetRequestResult>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    generateTotpSecret(req: any): Promise<{
        secret: string;
        qrCode: string;
    }>;
    enableTotp(req: any, code: string): Promise<{
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
    disableTotp(req: any): Promise<{
        message: string;
    }>;
}
