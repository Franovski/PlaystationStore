import { Module } from '@nestjs/common';
import { AdminController } from './adminController';
import { UsersModule } from '../users/userModule';
import { GameModule } from '../games/gameModule';
import { CategoryModule } from '../categories/categoryModule';
import { PlatformModule } from '../platforms/platformModule';

@Module({
  imports: [UsersModule, GameModule, CategoryModule, PlatformModule],
  controllers: [AdminController],
})
export class AdminModule {}
