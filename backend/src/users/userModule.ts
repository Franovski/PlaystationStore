import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './userEntity';
import { UsersService } from './userService';
import { UserResolver } from './userResolver';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UserResolver],
  exports: [UsersService],
})
export class UsersModule {}
