/**
 * @file userWalletDto.ts
 * @purpose Defines wallet GraphQL input contracts.
 * @overview Validates wallet funding amounts before service-level balance logic runs.
 * @responsibilities Prevents invalid or negative wallet funding requests.
 * @interaction Consumed by UserWalletResolver and UserWalletService.
 */
import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNumber, Min } from 'class-validator';

/**
 * Payload used to add wallet funds.
 *
 * @class AddWalletFundsDto
 */
@InputType()
export class AddWalletFundsDto {
  /**
   * Positive amount to add to the wallet.
   */
  @Field(() => Float)
  @IsNumber()
  @Min(0.01)
  amount: number;
}
