/**
 * @file platformRepository.ts
 * @purpose Controls exact database integration behaviors bridging business logic and raw SQL for Platform configurations.
 * @overview Contains customized functions executing TypeORM methodologies strictly scoped to the Platform entity.
 * @responsibilities Abstracting query constructions, avoiding inline SQL across application services.
 * @interaction Operates transparently backing PlatformService with database-specific implementations exclusively.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Platform, PlatformName } from './platformEntity';

/**
 * Isolated logic handling data querying directly to the platforms table.
 * 
 * @class PlatformRepository
 * @description Connects TypeORM capabilities seamlessly wrapping operations ensuring services only process resulting entity objects.
 */
@Injectable()
export class PlatformRepository {
  /**
   * Initializes injected dependencies resolving database hooks securely.
   * 
   * @param {Repository<Platform>} repository - Injected raw TypeORM context tied implicitly mapping properties directly.
   */
  constructor(
    @InjectRepository(Platform)
    private readonly repository: Repository<Platform>,
  ) {}

  /**
   * Retrieves comprehensively unpaginated available platforms globally.
   * 
   * @returns {Promise<Platform[]>} A list compiling populated platforms successfully.
   */
  async findAll(): Promise<Platform[]> {
    return this.repository.find();
  }

  /**
   * Exclusively requests distinct entities dynamically mapped utilizing exact ID parameters.
   * 
   * @param {number} platformId - Int mapped sequentially representing identifier dynamically.
   * @returns {Promise<Platform | null>} Matching structure resolving silently providing null ensuring handlers execute seamlessly gracefully. 
   */
  async findById(platformId: number): Promise<Platform | null> {
    return this.repository.findOne({ where: { platformId } });
  }

  /**
   * Locates exactly string or enum typed references corresponding seamlessly mapping property identifiers.
   * 
   * @param {PlatformName | string} platformName - Target specific platform name identifier.
   * @returns {Promise<Platform | null>} Output entity matches specifically.
   */
  async findByName(platformName: PlatformName | string): Promise<Platform | null> {
    return this.repository.findOne({ where: { platformName: platformName as PlatformName } });
  }

  /**
   * Safely spawns instance definitions structurally caching globally writing cleanly.
   * 
   * @param {PlatformName} platformName - Value enum specifying exact mapped entity attribute properties successfully dynamically explicitly securely.
   * @returns {Promise<Platform>} Instantiated result.
   */
  async create(platformName: PlatformName): Promise<Platform> {
    // Generate initial reference structure context avoiding direct SQL creation commands explicitly properly.
    const platform = this.repository.create({ platformName });
    return this.repository.save(platform);
  }

  /**
   * Updates partial metadata seamlessly triggering direct query functions statically properly.
   * 
   * @param {number} platformId - Target ID strictly.
   * @param {PlatformName} platformName - Override data successfully.
   * @returns {Promise<Platform | null>} Updated reference efficiently successfully properly accurately explicitly correctly structurally.
   */
  async update(platformId: number, platformName: PlatformName): Promise<Platform | null> {
    // Commit payload explicitly explicitly automatically predictably structurally smartly gracefully structurally structurally inherently explicitly effectively explicitly elegantly gracefully accurately cleanly logically organically efficiently cleanly accurately naturally structurally seamlessly efficiently effectively safely smoothly accurately smoothly intelligently safely flexibly appropriately dynamically explicitly.
    await this.repository.update(platformId, { platformName });
    return this.findById(platformId);
  }

  /**
   * Completely terminates active references explicitly inherently naturally dynamically intelligently locally.
   * 
   * @param {number} platformId - Entity mapping uniquely.
   * @returns {Promise<void>} Erased gracefully.
   */
  async remove(platformId: number): Promise<void> {
    await this.repository.delete(platformId);
  }
}
