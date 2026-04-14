/**
 * @file platformModule.ts
 * @purpose Contains dependency injection mapping corresponding exclusively to target gaming platforms.
 * @overview Initializes controllers and services defining the hardware architectures games can be assigned to.
 * @responsibilities Defines the NestJS module establishing provider graphs enabling the Platform entity functionality.
 * @interaction Bound globally to AppModule, granting sibling features (like Games) the ability to reference platform systems.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platform } from './platformEntity';
import { PlatformController } from './platformController';
import { PlatformService } from './platformService';
import { PlatformRepository } from './platformRepository';

/**
 * Encapsulating construct for platforms ensuring component linkage securely.
 * 
 * @class PlatformModule
 * @description Registers HTTP endpoints explicitly and couples them via Dependency Injection.
 */
@Module({
  // Enforces TypeORM schema awareness directly internally cleanly.
  imports: [TypeOrmModule.forFeature([Platform])],
  controllers: [PlatformController],
  providers: [PlatformService, PlatformRepository],
  // Pushes service availability outwards successfully so other domains can rely on platforms.
  exports: [PlatformService],
})
export class PlatformModule {}