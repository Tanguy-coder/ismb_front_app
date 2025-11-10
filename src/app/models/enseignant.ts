import { Role } from "./role";

export class Enseignant {
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
    statut?: string;
}