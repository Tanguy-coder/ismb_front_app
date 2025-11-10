import { Niveau } from "./niveau";

export class Matiere {
    id?: number;
    libelle?: string;
    sigle?: string;
    type?: string;
    niveaux?: Niveau[];
}