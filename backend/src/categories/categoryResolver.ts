import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoryService } from './categoryService';
import { Category } from './categoryEntity';
import { CreateCategoryDto, UpdateCategoryDto } from './categoryDto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from '../users/userEntity';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Category], { name: 'categories' })
  async getCategories() {
    return this.categoryService.getAllCategories();
  }

  @Query(() => Category, { nullable: true, name: 'category' })
  async getCategoryById(
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ) {
    return this.categoryService.getCategoryById(categoryId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Category)
  async createCategory(
    @Args('createCategoryInput') createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Category)
  async updateCategory(
    @Args('categoryId', { type: () => Int }) categoryId: number,
    @Args('updateCategoryInput') updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(categoryId, updateCategoryDto);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deleteCategory(
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ) {
    await this.categoryService.deleteCategory(categoryId);
    return true;
  }
}
