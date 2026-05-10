import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @Transform(({ value }: TransformFnParams): string =>
    typeof value === 'string' ? value.trim() : '',
  )
  @IsString()
  @IsNotEmpty()
  token: string;

  @Transform(({ value }: TransformFnParams): string | undefined =>
    typeof value === 'string' ? value.trim().toLowerCase() : undefined,
  )
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
