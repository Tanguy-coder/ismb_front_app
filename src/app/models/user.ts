import {Role} from "./role";

export class User {
    id?: number;
    nom?: string;
    prenom?: string;
    username?: string;
    contact?: string;
    password?: string;
    roles?: Role;
    isActive?: boolean;
}
