/**
 * @file orderItemDto.ts
 * @purpose Defines GraphQL input contracts for order item creation.
 * @overview Purchase requests provide item type and item ID; prices are calculated server-side.
 * @responsibilities Validates item type shape and identifier positivity.
 * @interaction Embedded inside CreateOrderDto and consumed by OrdersService.
 */
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, Min } from 'class-validator';

/**
 * Input payload for one requested purchase item.
 *
 * @class CreateOrderItemDto
 */
@InputType()
export class CreateOrderItemDto {
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
