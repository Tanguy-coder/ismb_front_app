import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Etablissement } from "../models/etablissement";

@Injectable({
  providedIn: 'root'
})
export class EtablissementService {
  private baseUrl = "/api/etablissements";

  constructor(private http: HttpClient) { }

  index(): Observable<Etablissement[]> {
    return this.http.get<Etablissement[]>(this.baseUrl);
  }

  store(formData: FormData): Observable<Etablissement> {
    return this.http.post<Etablissement>(this.baseUrl, formData);
  }

  show(id: string): Observable<Etablissement> {
    return this.http.get<Etablissement>(`${this.baseUrl}/${id}`);
  }

  update(id: number, formData: FormData): Observable<Etablissement> {
    return this.http.put<Etablissement>(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
