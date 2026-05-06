export declare class CreateGameDto {
    title: string;
    description?: string;
    releaseDate?: string;
    basePrice: number;
    developer?: string;
    publisher?: string;
    ageRating?: string;
}
export declare class UpdateGameDto {
    title?: string;
    description?: string;
    releaseDate?: string;
    basePrice?: number;
    developer?: string;
    publisher?: string;
    ageRating?: string;
}
