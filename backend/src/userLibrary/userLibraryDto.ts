/**
 * @file userLibraryDto.ts
 * @purpose Defines library input contracts used by controlled ownership grants.
 * @overview User IDs are not accepted from clients; they always come from auth context or service callers.
 * @responsibilities Validates purchasable item type and item identifier shape.
 * @interaction Used by UserLibraryResolver and UserLibraryService.
 */
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, Min } from 'class-validator';

/**
 * Input used to grant an item to the current user's library when exposed by privileged flows.
 *
 * @class AddLibraryItemDto
 */
@InputType()
export class AddLibraryItemDto {
  /**
   * Purchasable item type.
   */
  @Field()
  @IsIn(['game', 'dlc', 'edition'])
  itemType: string;

  /**
   * Purchasable item identifier.
   */
  @Field(() => Int)
  @IsInt()
  @Min(1)
  itemId: number;
}
