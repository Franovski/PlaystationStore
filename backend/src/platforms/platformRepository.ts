import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Platform } from './platformEntity';

@Injectable()
export class PlatformRepository {
  constructor(
    @InjectRepository(Platform)
    private readonly repository: Repository<Platform>,
  ) {}

  async findAll(): Promise<Platform[]> {
    return this.repository.find();
  }

  async findById(platformId: number): Promise<Platform | null> {
    return this.repository.findOne({ where: { platformId } });
  }

  async findByName(platformName: string): Promise<Platform | null> {
    return this.repository.findOne({ where: { platformName } });
  }

  async create(platformName: string): Promise<Platform> {
    const platform = this.repository.create({ platformName });
    return this.repository.save(platform);
  }

  async update(platformId: number, platformName: string): Promise<Platform | null> {
    await this.repository.update(platformId, { platformName });
    return this.findById(platformId);
  }

  async remove(platformId: number): Promise<void> {
    await this.repository.delete(platformId);
  }
}