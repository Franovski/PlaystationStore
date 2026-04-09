import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './categories/categoryModule';
import { PlatformModule } from './platforms/platformModule';
import { GameModule } from './games/gameModule';
import { GameCategoryModule } from './gameCategories/gameCategoryModule';
import { UsersModule } from './users/userModule';
import { AuthModule } from './auth/authModule';
import { MailModule } from './mail/mailModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.example',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'playstation_store'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    CategoryModule,
    PlatformModule,
    GameModule,
    GameCategoryModule,
    UsersModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }