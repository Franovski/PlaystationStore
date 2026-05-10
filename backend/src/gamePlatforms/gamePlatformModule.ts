import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamePlatform } from './gamePlatformEntity';
import { GamePlatformService } from './gamePlatformService';
import { GamePlatformRepository } from './gamePlatformRepository';
import { GameModule } from '../games/gameModule';
import { PlatformModule } from '../platforms/platformModule';
import { GamePlatformResolver } from './gamePlatformResolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([GamePlatform]),
    GameModule,
    PlatformModule,
  ],
  providers: [
    GamePlatformService,
    GamePlatformRepository,
    GamePlatformResolver,
  ],
  exports: [GamePlatformService],
})
export class GamePlatformModule {}
