/**
 * @file orderDto.ts
 * @purpose Defines GraphQL input contracts for purchase creation.
 * @overview Clients provide desired item references and payment method; prices and totals are calculated server-side.
 * @responsibilities Validates requested order shape before business logic resolves purchasable items.
 * @interaction Consumed by OrdersResolver and OrdersService.
 */
import { Field, InputType } from '@nestjs/graphql';
import { ArrayMinSize, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from '../orderItems/orderItemDto';

/**
 * Input payload for creating an order.
 *
 * @class CreateOrderDto
 */
@InputType()
export class CreateOrderDto {
  /**
   * Payment method. Wallet payments deduct customer wallet balance.
   */
  @Field()
  @IsIn(['wallet', 'card'])
  paymentMethod: string;

  /**
   * Requested items to purchase.
   */
  @Field(() => [CreateOrderItemDto])
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
