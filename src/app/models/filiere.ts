import {Niveau} from "./niveau";
import {AnneeScolaire} from "./annee-scolaire";

export class Filiere {
    id?: number;
    libelle?: string;
    description?: string;
    niveau?: Niveau;
    anneeScolaire?: AnneeScolaire;
}
