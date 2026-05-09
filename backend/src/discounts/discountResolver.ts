/**
 * @file discountResolver.ts
 * @purpose Exposes GraphQL operations for game discounts.
 * @overview Supports storefront read queries and admin-only discount mutations.
 * @responsibilities Routes discount GraphQL operations into DiscountService.
 * @interaction Used by Apollo clients for discount display and management.
 */
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Discount } from './discountEntity';
import { DiscountService } from './discountService';
import { CreateDiscountDto, UpdateDiscountDto } from './discountDto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from '../users/userEntity';

/**
 * Resolver for discounts.
 *
 * @class DiscountResolver
 */
@Resolver(() => Discount)
export class DiscountResolver {
  constructor(private readonly discountService: DiscountService) {}

  @Query(() => [Discount])
  async discounts(@Args('gameId', { type: () => Int, nullable: true }) gameId?: number) {
    if (gameId) {
      return this.discountService.getDiscountsByGameId(gameId);
    }

    return this.discountService.getAllDiscounts();
  }

  @Query(() => [Discount])
  async activeDiscounts(@Args('gameId', { type: () => Int }) gameId: number) {
    return this.discountService.getActiveDiscountsForGame(gameId);
  }

  @Query(() => Discount)
  async discount(@Args('id', { type: () => Int }) id: number) {
    return this.discountService.getDiscountById(id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Discount)
  async createDiscount(@Args('createDiscountInput') createDiscountInput: CreateDiscountDto) {
    return this.discountService.createDiscount(createDiscountInput);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Discount)
  async updateDiscount(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateDiscountInput') updateDiscountInput: UpdateDiscountDto,
  ) {
    return this.discountService.updateDiscount(id, updateDiscountInput);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deleteDiscount(@Args('id', { type: () => Int }) id: number) {
    await this.discountService.deleteDiscount(id);
    return true;
  }
}
