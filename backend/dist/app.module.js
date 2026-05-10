"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const categoryModule_1 = require("./categories/categoryModule");
const platformModule_1 = require("./platforms/platformModule");
const gameModule_1 = require("./games/gameModule");
const gameCategoryModule_1 = require("./gameCategories/gameCategoryModule");
const gamePlatformModule_1 = require("./gamePlatforms/gamePlatformModule");
const userModule_1 = require("./users/userModule");
const authModule_1 = require("./auth/authModule");
const mailModule_1 = require("./mail/mailModule");
const adminModule_1 = require("./admin/adminModule");
const dlcModule_1 = require("./dlc/dlcModule");
const editionModule_1 = require("./editions/editionModule");
const discountModule_1 = require("./discounts/discountModule");
const wishlistModule_1 = require("./wishlist/wishlistModule");
const userLibraryModule_1 = require("./userLibrary/userLibraryModule");
const reviewModule_1 = require("./reviews/reviewModule");
const userWalletModule_1 = require("./userWallet/userWalletModule");
const orderModule_1 = require("./orders/orderModule");
const orderItemModule_1 = require("./orderItems/orderItemModule");
const storefrontModule_1 = require("./storefront/storefrontModule");
const customerDashboardModule_1 = require("./customerDashboard/customerDashboardModule");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                sortSchema: true,
                context: ({ req, res }) => ({ req, res }),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const synchronize = String(configService.get('DATABASE_SYNCHRONIZE', 'false')).toLowerCase() === 'true';
                    return {
                        type: 'postgres',
                        host: configService.get('DB_HOST', 'localhost'),
                        port: configService.get('DB_PORT', 5432),
                        username: configService.get('DB_USERNAME', 'postgres'),
                        password: configService.get('DB_PASSWORD', 'postgres'),
                        database: configService.get('DB_NAME', 'playstation_store'),
                        autoLoadEntities: true,
                        synchronize,
                        extra: {
                            max: 20,
                        },
                    };
                },
            }),
            categoryModule_1.CategoryModule,
            platformModule_1.PlatformModule,
            gameModule_1.GameModule,
            gameCategoryModule_1.GameCategoryModule,
            gamePlatformModule_1.GamePlatformModule,
            userModule_1.UsersModule,
            authModule_1.AuthModule,
            mailModule_1.MailModule,
            adminModule_1.AdminModule,
            dlcModule_1.DLCModule,
            editionModule_1.EditionModule,
            discountModule_1.DiscountModule,
            wishlistModule_1.WishlistModule,
            userLibraryModule_1.UserLibraryModule,
            reviewModule_1.ReviewModule,
            userWalletModule_1.UserWalletModule,
            orderModule_1.OrderModule,
            orderItemModule_1.OrderItemModule,
            storefrontModule_1.StorefrontModule,
            customerDashboardModule_1.CustomerDashboardModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map