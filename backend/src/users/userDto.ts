import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { UserRole, PasswordResetMethod } from './userEntity';

@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field({ nullable: true })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  country: string;

  @Field()
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @Field(() => UserRole, { nullable: true })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

@InputType()
export class UpdateUserDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  username?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  country?: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @Field(() => UserRole, { nullable: true })
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

  @Field({ nullable: true })
  @IsOptional()
  isTotpEnabled?: boolean;

  @IsString()
  @IsOptional()
  totpSecret?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  isEmailVerified?: boolean;
}

@InputType()
export class UpdateUserSettingsDto {
  @Field(() => UserRole, { nullable: true })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isTotpEnabled?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  password?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  totpSecret?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  refreshToken?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  passwordResetToken?: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  passwordResetExpires?: string;

  @Field(() => PasswordResetMethod, { nullable: true })
  @IsEnum(PasswordResetMethod)
  @IsOptional()
  passwordResetMethod?: PasswordResetMethod;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  passwordResetAttempts?: number;
}
