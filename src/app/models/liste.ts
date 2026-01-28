import {Role} from "./role";
import {Filiere} from "./filiere";

export class Liste {
    nom?: string;
    prenom?: string;
    sexe?: string;
    dateNaissance?: Date;
    lieuNaissance?: string;
    contact?: string;
    nationalite?: string;
    photo?: string;
    filiere?: Filiere;
}
