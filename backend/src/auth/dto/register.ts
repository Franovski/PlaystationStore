import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';
import { UserRole } from '../../users/userEntity';

export class RegisterDto {
  @IsString()
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

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
}
