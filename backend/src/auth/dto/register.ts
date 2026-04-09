import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty, IsDateString } from 'class-validator';

export class RegisterDto {
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
