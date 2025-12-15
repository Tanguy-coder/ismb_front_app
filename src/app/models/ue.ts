import {Filiere} from "./filiere";
import {Matiere} from "./matiere";
import {Enseignant} from "./enseignant";
import {AnneeScolaire} from "./annee-scolaire";

export class Ue {
    id?: number;
    libelle!: string;
    credits!: number;
    code!: string;
    filiere!: Filiere;
    volumeHoraire!: number;
    //notes?: Note[];
    matiere!: Matiere;
    enseignant!: Enseignant;
    anneeScolaire!: AnneeScolaire;
}
