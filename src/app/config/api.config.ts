import { environment } from '../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  endpoints: {
    auth: `${environment.apiUrl}/auth`,
    users: `${environment.apiUrl}/users`,
    etudiants: `${environment.apiUrl}/etudiants`,
    enseignants: `${environment.apiUrl}/enseignants`,
    filieres: `${environment.apiUrl}/filieres`,
    niveaux: `${environment.apiUrl}/niveaux`,
    matieres: `${environment.apiUrl}/matieres`,
    ues: `${environment.apiUrl}/ues`,
    notes: `${environment.apiUrl}/notes`,
    etablissements: `${environment.apiUrl}/etablissements`,
    annees: `${environment.apiUrl}/annees`,
    roles: `${environment.apiUrl}/roles`,
    permissions: `${environment.apiUrl}/permissions`,
  }
};





