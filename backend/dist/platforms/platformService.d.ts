import { CreatePlatformDto, UpdatePlatformDto } from './platformDto';
import { Platform } from './platformEntity';
import { PlatformRepository } from './platformRepository';
export declare class PlatformService {
    private readonly platformRepository;
    constructor(platformRepository: PlatformRepository);
    getAllPlatforms(): Promise<Platform[]>;
    getPlatformById(id: number): Promise<Platform>;
    getPlatformByName(name: string): Promise<Platform>;
    createPlatform(createDto: CreatePlatformDto): Promise<Platform>;
    updatePlatform(id: number, updateDto: UpdatePlatformDto): Promise<Platform>;
    deletePlatform(id: number): Promise<void>;
}
