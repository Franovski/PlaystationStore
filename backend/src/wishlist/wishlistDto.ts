/**
 * @file wishlistDto.ts
 * @purpose Defines GraphQL input for wishlist mutations.
 * @overview Accepts only the game identifier because user ownership comes from the authenticated token.
 * @responsibilities Validates target game IDs for wishlist changes.
 * @interaction Consumed by WishlistResolver and WishlistService.
 */
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

/**
 * Input payload for adding a game to the current user's wishlist.
 *
 * @class AddWishlistItemDto
 */
@InputType()
export class AddWishlistItemDto {
  /**
   * Game to save.
   */
  @Field(() => Int)
  @IsInt()
  @Min(1)
  gameId: number;
}
