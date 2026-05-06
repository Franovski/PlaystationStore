import { Module } from '@nestjs/common';
import { AdminResolver } from './adminResolver';
import { UsersModule } from '../users/userModule';
import { GameModule } from '../games/gameModule';
import { CategoryModule } from '../categories/categoryModule';
import { PlatformModule } from '../platforms/platformModule';

@Module({
  imports: [UsersModule, GameModule, CategoryModule, PlatformModule],
  providers: [AdminResolver],
})
export class AdminModule {}
