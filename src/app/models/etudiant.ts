import {Filiere} from "./filiere";
import {Role} from "./role";

export class Etudiant {
    id?: number;
    nom?: string;
    prenom?: string;
    username?: string;
    password?: string;
    roles?: Role[];
    isActive?: boolean;
    sexe?: string;
    dateNaissance?: Date;
    lieuNaissance?: string;
    contact?: string;
    email?: string;
    nationalite?: string;
    photo?: string;
    filiere?: Filiere;
    attentes?: string;
    statut?: string;
}
