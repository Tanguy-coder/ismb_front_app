import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Etudiant } from "../models/etudiant";

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  private baseUrl = "http://localhost:8080/api/etudiants";

  constructor(private http: HttpClient) { }

  index(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(this.baseUrl);
  }

  store(formData: FormData): Observable<Etudiant> {
    return this.http.post<Etudiant>(this.baseUrl, formData);
  }

  show(id: string): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.baseUrl}/${id}`);
  }

  update(id: number, formData: FormData): Observable<Etudiant> {
    return this.http.put<Etudiant>(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}