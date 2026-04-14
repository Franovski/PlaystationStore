/**
 * @file categoryService.ts
 * @purpose Encapsulates the core business logic, policies, and safeguards for category objects.
 * @overview Contains validation routines and handles requests originating from the category controller before executing data persistence.
 * @responsibilities Asserts constraints such as uniqueness on category names, orchestrating creates/updates dynamically, and fetching robustly to avoid unhandled errors.
 * @interaction Acts as the middleman; called by CategoryController to fulfill user objectives and accesses CategoryRepository to transact strictly with database tables.
 */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CategoryRepository } from './categoryRepository';
import { CreateCategoryDto, UpdateCategoryDto } from './categoryDto';
import { Category } from './categoryEntity';

/**
 * Service encapsulating category domains logic.
 * 
 * @class CategoryService
 * @description Performs data validations specific to store taxonomy (categories) and surfaces safe patterns to retrieve them via IDs or specific naming.
 */
@Injectable()
export class CategoryService {
  /**
   * Standard class constructor defining internal dependencies.
   * 
   * @param {CategoryRepository} categoryRepository - Abstract access tool referencing Category persistence.
   */
  constructor(private readonly categoryRepository: CategoryRepository) {}

  /**
   * Retrieves all globally available categories regardless of usage.
   * 
   * @returns {Promise<Category[]>} Array containing all Category entity records.
   */
  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  /**
   * Retrieves a specifically identified category using its ID numeric scalar.
   * 
   * @param {number} id - Int mapped sequentially generated ID.
   * @throws {NotFoundException} Encountered if the parameter yields no database matches cleanly.
   * @returns {Promise<Category>} Reconstructs the exact matched Category.
   */
  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  /**
   * Resolves a singular category based directly on an exact text mapping of its name flag.
   * 
   * @param {string} name - The URL parameter representing the category's unique name.
   * @throws {NotFoundException} Triggers if the request expects an unregistered text variant mapping.
   * @returns {Promise<Category>} Resulting precise entity query result.
   */
  async getCategoryByName(name: string): Promise<Category> {
    const category = await this.categoryRepository.findByName(name);
    if (!category) {
      throw new NotFoundException(`Category with name '${name}' not found`);
    }
    return category;
  }

  /**
   * Evaluates logic prerequisites, establishing another distinct Category variant mapped to a name string constraint. 
   * 
   * @param {CreateCategoryDto} createDto - Payload carrying the new category's name parameter.
   * @throws {ConflictException} Halts execution dynamically if attempting to violate uniqueness configuration mappings (e.g., trying to write 'RPG' 2x).
   * @returns {Promise<Category>} Successfully built mapping representation inserted securely.
   */
  async createCategory(createDto: CreateCategoryDto): Promise<Category> {
    // Assert constraint that another category holding this display token does not map identically.
    const existing = await this.categoryRepository.findByName(createDto.categoryName);
    if (existing) {
      throw new ConflictException(`Category with name '${createDto.categoryName}' already exists`);
    }
    return this.categoryRepository.create(createDto.categoryName);
  }

  /**
   * Commits logical updates validating modifications aren't shadowing reserved taxonomy definitions implicitly mapping to alternate category identifiers.
   * 
   * @param {number} id - Target numeric identifier.
   * @param {UpdateCategoryDto} updateDto - Subset payload struct carrying possible name overrides.
   * @throws {ConflictException} Raised purposefully assuming renaming forces overlap on established namespaces statically.
   * @throws {NotFoundException} Dispatched broadly expecting non-applicable ID invocations structurally.
   * @returns {Promise<Category>} Returning entity result properly modeled.
   */
  async updateCategory(id: number, updateDto: UpdateCategoryDto): Promise<Category> {
    // No-op if no real modifying payload definitions exist mapped in structure.
    if (!updateDto.categoryName) {
        return this.getCategoryById(id);
    }

    // Throw rapidly when querying non-resolved category dependencies initially preventing ghost modifications efficiently.
    await this.getCategoryById(id);

    // Cross-validate that a category renaming process isn't infringing against isolated categories mapped locally already preventing unique index DB halts actively.
    const existing = await this.categoryRepository.findByName(updateDto.categoryName);
    if (existing && existing.categoryId !== id) {
      throw new ConflictException(`Category with name '${updateDto.categoryName}' already exists`);
    }

    const category = await this.categoryRepository.update(id, updateDto.categoryName);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  /**
   * Permanently clears taxonomic entities mapped to specific scalars directly globally preventing structural references gracefully removing category ID structurally mapped dependencies locally structurally.
   * 
   * @param {number} id - Int mapped identifier parsed structurally via parameter references defining category dynamically.
   * @throws {NotFoundException} Structural execution error triggered explicitly resolving empty values gracefully terminating.
   * @returns {Promise<void>} Resolves normally acknowledging clean entity detachment processes fully.
   */
  async deleteCategory(id: number): Promise<void> {
    // Halt deletion attempts requesting unestablished database mapping parameters statically throwing rapidly dynamically ensuring safety structurally explicitly.
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    await this.categoryRepository.remove(id);
  }
}
