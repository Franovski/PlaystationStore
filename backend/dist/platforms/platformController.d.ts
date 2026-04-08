import { PlatformService } from './platformService';
import { CreatePlatformDto, UpdatePlatformDto } from './platformDto';
export declare class PlatformController {
    private readonly platformService;
    constructor(platformService: PlatformService);
    getAll(): Promise<import("./platformEntity").Platform[]>;
    getOneByName(name: string): Promise<import("./platformEntity").Platform>;
    getOne(id: number): Promise<import("./platformEntity").Platform>;
    create(createDto: CreatePlatformDto): Promise<import("./platformEntity").Platform>;
    update(id: number, updateDto: UpdatePlatformDto): Promise<import("./platformEntity").Platform>;
    delete(id: number): Promise<void>;
}
