import { Repository } from 'typeorm';
import { Platform } from './platformEntity';
export declare class PlatformRepository {
    private readonly repository;
    constructor(repository: Repository<Platform>);
    findAll(): Promise<Platform[]>;
    findById(platformId: number): Promise<Platform | null>;
    findByName(platformName: string): Promise<Platform | null>;
    create(platformName: string): Promise<Platform>;
    update(platformId: number, platformName: string): Promise<Platform | null>;
    remove(platformId: number): Promise<void>;
}
