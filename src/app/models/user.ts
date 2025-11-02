import {Role} from "./role";

export class User {
    id?: number;
    nom?: string;
    prenom?: string;
    username?: string;
    contact?: string;
    email?: string;
    password?: string;
    roles?: Role;
    active?: boolean;


}
