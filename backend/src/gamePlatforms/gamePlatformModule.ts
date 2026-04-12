import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamePlatform } from './gamePlatformEntity';
import { GamePlatformController } from './gamePlatformController';
import { GamePlatformService } from './gamePlatformService';
import { GamePlatformRepository } from './gamePlatformRepository';
import { GameModule } from '../games/gameModule';
import { PlatformModule } from '../platforms/platformModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([GamePlatform]),
    GameModule,
    PlatformModule,
  ],
  controllers: [GamePlatformController],
  providers: [GamePlatformService, GamePlatformRepository],
  exports: [GamePlatformService],
})
export class GamePlatformModule {}
