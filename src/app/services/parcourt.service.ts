import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListeClasse } from '../models/liste-classe';

@Injectable({
  providedIn: 'root'
})
export class ParcourtService {
  baseUrl: string = '/api/parcourt';

  constructor(private http: HttpClient) { }

  getListeClasse(filiereId: number, anneeScolaireId: number): Observable<ListeClasse[]> {
    return this.http.get<ListeClasse[]>(`${this.baseUrl}/liste-classe/${filiereId}/${anneeScolaireId}`);
  }
}

