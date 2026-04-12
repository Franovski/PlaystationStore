import { UserRole } from '../../users/userEntity';
export declare class RegisterDto {
    role?: UserRole;
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    country: string;
    dateOfBirth: string;
}
