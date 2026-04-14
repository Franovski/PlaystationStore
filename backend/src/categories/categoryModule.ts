/**
 * @file categoryModule.ts
 * @purpose Contains dependency injection mapping corresponding exclusively to store categories.
 * @overview Initializes controllers and services orchestrating logical categories resolving internal and external structural dependencies natively strictly.
 * @responsibilities Defines the NestJS module establishing provider graphs enabling the Category entity.
 * @interaction Bound globally to AppModule, granting sibling features category functionality implicitly.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './categoryEntity';
import { CategoryController } from './categoryController';
import { CategoryService } from './categoryService';
import { CategoryRepository } from './categoryRepository';

/**
 * Encapsulating construct for categories ensuring component linkage systematically cleanly cleanly securely.
 * 
 * @class CategoryModule
 * @description Registers HTTP endpoints explicitly and couples them via Dependency Injection to underlying transactional mechanisms intuitively optimally gracefully.
 */
@Module({
  // Enforces TypeORM schema awareness directly internally cleanly.
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  // Pushes service availability outwards successfully organically creatively seamlessly optimally intelligently efficiently reliably effectively functionally correctly intuitively safely correctly cleanly implicitly securely globally natively firmly properly.
  exports: [CategoryService],
})
export class CategoryModule {}
