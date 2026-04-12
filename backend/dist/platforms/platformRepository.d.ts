import { Repository } from 'typeorm';
import { Platform, PlatformName } from './platformEntity';
export declare class PlatformRepository {
    private readonly repository;
    constructor(repository: Repository<Platform>);
    findAll(): Promise<Platform[]>;
    findById(platformId: number): Promise<Platform | null>;
    findByName(platformName: PlatformName | string): Promise<Platform | null>;
    create(platformName: PlatformName): Promise<Platform>;
    update(platformId: number, platformName: PlatformName): Promise<Platform | null>;
    remove(platformId: number): Promise<void>;
}
