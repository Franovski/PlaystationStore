import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  MinLength,
} from 'class-validator';
import { UserRole, PasswordResetMethod } from './userEntity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  refreshToken?: string | null;

  @IsString()
  @IsOptional()
  passwordResetToken?: string | null;

  @IsString()
  @IsOptional()
  passwordResetExpires?: Date | null;

  @IsEnum(PasswordResetMethod)
  @IsOptional()
  passwordResetMethod?: PasswordResetMethod | null;

  @IsOptional()
  passwordResetAttempts?: number;

  @IsOptional()
  isTotpEnabled?: boolean;

  @IsString()
  @IsOptional()
  totpSecret?: string | null;

  @IsOptional()
  isEmailVerified?: boolean;
}