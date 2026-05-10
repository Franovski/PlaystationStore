/**
 * @file orderItemResolver.ts
 * @purpose Exposes GraphQL operations for reading order line items.
 * @overview Authenticates access and enforces order ownership.
 * @responsibilities Routes order item queries to OrderItemService.
 * @interaction Used by order history screens when expanded item details are needed.
 */
import {
  Args,
  Context,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrderItem } from './orderItemEntity';
import { OrderItemService } from './orderItemService';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from '../users/userEntity';
import { Game } from '../games/gameEntity';
import { GameService } from '../games/gameService';
import { DLC } from '../dlc/dlcEntity';
import { DLCService } from '../dlc/dlcService';
import { Edition } from '../editions/editionEntity';
import { EditionService } from '../editions/editionService';

type GqlRequestContext = {
  req: {
    user: {
      userId: string;
      role?: string;
    };
  };
};

/**
 * Resolver for order item operations.
 *
 * @class OrderItemResolver
 */
@Resolver(() => OrderItem)
export class OrderItemResolver {
  constructor(
    private readonly orderItemService: OrderItemService,
    private readonly gameService: GameService,
    private readonly dlcService: DLCService,
    private readonly editionService: EditionService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [OrderItem])
  async orderItems(
    @Args('orderId', { type: () => Int }) orderId: number,
    @Context() context: GqlRequestContext,
  ) {
    return this.orderItemService.getItemsForOrder(
      orderId,
      context.req.user.userId,
      context.req.user.role,
    );
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Query(() => [OrderItem])
  async adminOrderItems() {
    return this.orderItemService.getAllItems();
  }

  @ResolveField(() => Game, { nullable: true })
  async game(@Parent() item: OrderItem): Promise<Game | null> {
    if (item.itemType !== 'game') {
      return null;
    }

    try {
      return await this.gameService.getGameById(item.itemId);
    } catch {
      return null;
    }
  }

  @ResolveField(() => DLC, { nullable: true })
  async dlc(@Parent() item: OrderItem): Promise<DLC | null> {
    if (item.itemType !== 'dlc') {
      return null;
    }

    try {
      return await this.dlcService.getDLCByIdWithGame(item.itemId);
    } catch {
      return null;
    }
  }

  @ResolveField(() => Edition, { nullable: true })
  async edition(@Parent() item: OrderItem): Promise<Edition | null> {
    if (item.itemType !== 'edition') {
      return null;
    }

    try {
      return await this.editionService.getEditionById(item.itemId);
    } catch {
      return null;
    }
  }
}
