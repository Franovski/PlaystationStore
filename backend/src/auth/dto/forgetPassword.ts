import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @Transform(({ value }: TransformFnParams): string =>
    typeof value === 'string' ? value.trim().toLowerCase() : '',
  )
  @IsEmail()
  email: string;
}
