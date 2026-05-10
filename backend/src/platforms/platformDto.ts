import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { PlatformName } from './platformEntity';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePlatformDto {
  @Field(() => PlatformName)
  @IsEnum(PlatformName, { message: 'platformName must be either ps4 or ps5' })
  @IsNotEmpty()
  platformName: PlatformName;
}

@InputType()
export class UpdatePlatformDto {
  @Field(() => PlatformName, { nullable: true })
  @IsOptional()
  @IsEnum(PlatformName, { message: 'platformName must be either ps4 or ps5' })
  @IsNotEmpty()
  platformName?: PlatformName;
}
