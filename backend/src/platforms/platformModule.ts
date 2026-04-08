import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platform } from './platformEntity';
import { PlatformController } from './platformController';
import { PlatformService } from './platformService';
import { PlatformRepository } from './platformRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Platform])],
  controllers: [PlatformController],
  providers: [PlatformService, PlatformRepository],
  exports: [PlatformService],
})
export class PlatformModule {}