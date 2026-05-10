import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../../users/userEntity';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterDto {
  @Field(() => UserRole, { nullable: true })
  @IsString()
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(8)
  password: string;

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
}
