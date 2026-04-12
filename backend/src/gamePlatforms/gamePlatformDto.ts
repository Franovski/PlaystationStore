import { IsInt, IsNotEmpty } from 'class-validator';

export class AddGamePlatformDto {
  @IsInt()
  @IsNotEmpty()
  gameId: number;

  @IsInt()
  @IsNotEmpty()
  platformId: number;
}
