import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Matiere } from "../models/matiere";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MatiereService {
  baseUrl: string = '/api/matieres';

  constructor(private http: HttpClient) { }

  index(): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(this.baseUrl);
  }

  store(matiere: Matiere): Observable<Matiere> {
    return this.http.post<Matiere>(this.baseUrl, matiere);
  }

  show(id: number): Observable<Matiere> {
    return this.http.get<Matiere>(`${this.baseUrl}/${id}`);
  }

  update(id: number, matiere: Matiere): Observable<Matiere> {
    return this.http.put<Matiere>(`${this.baseUrl}/${id}`, matiere);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
