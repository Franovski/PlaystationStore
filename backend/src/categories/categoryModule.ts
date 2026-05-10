import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './categoryEntity';
import { CategoryRepository } from './categoryRepository';
import { CategoryResolver } from './categoryResolver';
import { CategoryService } from './categoryService';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService, CategoryRepository, CategoryResolver],
  exports: [CategoryService],
})
export class CategoryModule {}
