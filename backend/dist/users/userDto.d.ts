import { UserRole, PasswordResetMethod } from './userEntity';
export declare class CreateUserDto {
    username: string;
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    country: string;
    dateOfBirth: string;
    role?: UserRole;
}
export declare class UpdateUserDto {
    username?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    country?: string;
    dateOfBirth?: string;
    role?: UserRole;
    refreshToken?: string | null;
    passwordResetToken?: string | null;
    passwordResetExpires?: Date | null;
    passwordResetMethod?: PasswordResetMethod | null;
    passwordResetAttempts?: number;
    isTotpEnabled?: boolean;
    totpSecret?: string | null;
    isEmailVerified?: boolean;
}
