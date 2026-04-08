export declare class CreateGameDto {
    title: string;
    description?: string;
    releaseDate?: Date;
    basePrice: number;
    developer?: string;
    publisher?: string;
    ageRating?: string;
}
export declare class UpdateGameDto {
    title?: string;
    description?: string;
    releaseDate?: Date;
    basePrice?: number;
    developer?: string;
    publisher?: string;
    ageRating?: string;
}
