export interface Boss {
    name: string;
    location: string;
    isDLC: boolean;
    isOptional: boolean;
    soulDrop: string;
    game: string;
    image: string; // Caminho para a imagem do chefe
}

export interface Game {
    game: string;
    bosses: Boss[];
}
