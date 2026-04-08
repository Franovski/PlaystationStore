import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PlatformRepository } from './platformRepository';
import { CreatePlatformDto, UpdatePlatformDto } from './platformDto';
import { Platform } from './platformEntity';

@Injectable()
export class PlatformService {
  constructor(private readonly platformRepository: PlatformRepository) {}

  async getAllPlatforms(): Promise<Platform[]> {
    return this.platformRepository.findAll();
  }

  async getPlatformById(id: number): Promise<Platform> {
    const platform = await this.platformRepository.findById(id);
    if (!platform) {
      throw new NotFoundException(`Platform with ID ${id} not found`);
    }
    return platform;
  }

  async getPlatformByName(name: string): Promise<Platform> {
    const platform = await this.platformRepository.findByName(name);
    if (!platform) {
      throw new NotFoundException(`Platform with name '${name}' not found`);
    }
    return platform;
  }

  async createPlatform(createDto: CreatePlatformDto): Promise<Platform> {
    const existing = await this.platformRepository.findByName(createDto.platformName);
    if (existing) {
      throw new ConflictException(`Platform with name '${createDto.platformName}' already exists`);
    }
    return this.platformRepository.create(createDto.platformName);
  }

  async updatePlatform(id: number, updateDto: UpdatePlatformDto): Promise<Platform> {
    if (!updateDto.platformName) {
        return this.getPlatformById(id);
    }
    
    // Check if what we are trying to update exists
    await this.getPlatformById(id);

    const existing = await this.platformRepository.findByName(updateDto.platformName);
    if (existing && existing.platformId !== id) {
      throw new ConflictException(`Platform with name '${updateDto.platformName}' already exists`);
    }

    const platform = await this.platformRepository.update(id, updateDto.platformName);
    if (!platform) {
      throw new NotFoundException(`Platform with ID ${id} not found`);
    }
    return platform;
  }

  async deletePlatform(id: number): Promise<void> {
    const platform = await this.platformRepository.findById(id);
    if (!platform) {
      throw new NotFoundException(`Platform with ID ${id} not found`);
    }
    await this.platformRepository.remove(id);
  }
}