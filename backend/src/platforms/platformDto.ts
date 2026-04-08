import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePlatformDto {
  @IsString()
  @IsNotEmpty()
  platformName: string;
}

export class UpdatePlatformDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  platformName?: string;
}