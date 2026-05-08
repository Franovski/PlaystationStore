import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './categories/categoryModule';
import { PlatformModule } from './platforms/platformModule';
import { GameModule } from './games/gameModule';
import { GameCategoryModule } from './gameCategories/gameCategoryModule';
import { GamePlatformModule } from './gamePlatforms/gamePlatformModule';
import { UsersModule } from './users/userModule';
import { AuthModule } from './auth/authModule';
import { MailModule } from './mail/mailModule';
import { AdminModule } from './admin/adminModule';
import { DLCModule } from './dlc/dlcModule';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res }: { req: any; res: any }) => ({ req, res }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const synchronize =
          String(configService.get('DATABASE_SYNCHRONIZE', 'false')).toLowerCase() ===
          'true';

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_NAME', 'playstation_store'),
          autoLoadEntities: true,
          synchronize,
        };
      },
    }),
    CategoryModule,
    PlatformModule,
    GameModule,
    GameCategoryModule,
    GamePlatformModule,
    UsersModule,
    AuthModule,
    MailModule,
    AdminModule,
    DLCModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
