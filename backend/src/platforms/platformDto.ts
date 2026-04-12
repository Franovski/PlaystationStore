import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { PlatformName } from './platformEntity';

export class CreatePlatformDto {
  @IsEnum(PlatformName, { message: 'platformName must be either ps4 or ps5' })
  @IsNotEmpty()
  platformName: PlatformName;
}

export class UpdatePlatformDto {
  @IsOptional()
  @IsEnum(PlatformName, { message: 'platformName must be either ps4 or ps5' })
  @IsNotEmpty()
  platformName?: PlatformName;
}
