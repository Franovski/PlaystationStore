/**
 * @file categoryController.ts
 * @purpose Controls incoming HTTP requests for category management.
 * @overview Defines the REST API endpoints to fetch, create, update, and delete categories within the system.
 * @responsibilities Maps HTTP routes to the business logic provided by the CategoryService, unwraps request parameters/bodies, and returns proper HTTP responses.
 * @interaction Serves as the outer HTTP interface for categories, injecting CategoryService to perform actual CRUD logic.
 */
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoryService } from './categoryService';
import { CreateCategoryDto, UpdateCategoryDto } from './categoryDto';

/**
 * Controller responsible for category-related REST endpoints.
 * 
 * @class CategoryController
 * @description Exposes paths like `/categories` enabling external clients to manage game category taxonomies.
 */
@Controller('categories')
export class CategoryController {
  /**
   * Initializes the CategoryController.
   * 
   * @param {CategoryService} categoryService - Injected service that implements business rules for categories.
   */
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Retrieves all categorizations defined in the system.
   * 
   * @returns {Promise<Category[]>} A promise resolving to an array of completely hydrated Category entities.
   */
  @Get()
  async getAll() {
    return this.categoryService.getAllCategories();
  }

  /**
   * Resolves a category by an exact name lookup.
   * 
   * @param {string} name - The URL parameter representing the category's unique name.
   * @returns {Promise<Category>} A promise resolving to the corresponding Category entity.
   */
  @Get('name/:name')
  async getOneByName(@Param('name') name: string) {
    return this.categoryService.getCategoryByName(name);
  }

  /**
   * Retrieves a category by its numeric ID.
   * 
   * @param {number} id - URL parameter ID parsed as an integer.
   * @returns {Promise<Category>} A promise resolving to the exact Category.
   */
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCategoryById(id);
  }

  /**
   * Creates a new classification category.
   * 
   * @param {CreateCategoryDto} createDto - Payload carrying the new category's name.
   * @returns {Promise<Category>} A promise resolving to the newly created and stored Category.
   */
  @Post()
  async create(@Body() createDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createDto);
  }

  /**
   * Modifies an existing category's properties (like renaming).
   * 
   * @param {number} id - Numeric identifier parsed securely via pipes.
   * @param {UpdateCategoryDto} updateDto - Subset of Category fields provided by the client.
   * @returns {Promise<Category>} A promise resolving to the updated Category entity.
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateDto);
  }

  /**
   * Removes a category from the database permanently.
   * 
   * @param {number} id - Target numeric identifier.
   * @returns {Promise<void>} Resolves with a 204 No Content HTTP standard response on successful completion.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}