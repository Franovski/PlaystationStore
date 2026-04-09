export declare enum UserRole {
    ADMIN = "admin",
    PLAYSTATION_USER = "playstation_user"
}
export declare enum PasswordResetMethod {
    OTP = "otp",
    LINK = "link"
}
export declare class User {
    userId: number;
    username: string;
    email: string;
    password: string | null;
    firstName: string;
    lastName: string;
    country: string;
    dateOfBirth: Date;
    role: UserRole;
    isEmailVerified: boolean;
    totpSecret: string | null;
    isTotpEnabled: boolean;
    refreshToken: string | null;
    passwordResetToken: string | null;
    passwordResetExpires: Date | null;
    passwordResetMethod: PasswordResetMethod | null;
    passwordResetAttempts: number;
    createdAt: Date;
    updatedAt: Date;
}
