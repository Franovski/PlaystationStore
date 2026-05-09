/**
 * @file storefrontModule.ts
 * @purpose Registers customer-facing store aggregation providers.
 * @overview Imports existing feature modules and exposes catalog/detail GraphQL queries.
 * @responsibilities Keeps read aggregation separate from core CRUD modules.
 * @interaction Imported by AppModule for frontend game browsing and details.
 */
import { Module } from '@nestjs/common';
import { StorefrontService } from './storefrontService';
import { StorefrontResolver } from './storefrontResolver';
import { GameModule } from '../games/gameModule';
import { DLCModule } from '../dlc/dlcModule';
import { EditionModule } from '../editions/editionModule';
import { DiscountModule } from '../discounts/discountModule';
import { GameCategoryModule } from '../gameCategories/gameCategoryModule';
import { GamePlatformModule } from '../gamePlatforms/gamePlatformModule';
import { ReviewModule } from '../reviews/reviewModule';

/**
 * Module encapsulating storefront aggregation.
 *
 * @class StorefrontModule
 */
@Module({
  imports: [
    GameModule,
    DLCModule,
    EditionModule,
    DiscountModule,
    GameCategoryModule,
    GamePlatformModule,
    ReviewModule,
  ],
  providers: [StorefrontService, StorefrontResolver],
})
export class StorefrontModule {}
