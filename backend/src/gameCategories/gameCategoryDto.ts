import { IsInt, IsNotEmpty } from 'class-validator';

export class AddGameCategoryDto {
  @IsInt()
  @IsNotEmpty()
  gameId: number;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}