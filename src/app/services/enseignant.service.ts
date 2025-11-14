import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Enseignant } from "../models/enseignant";

@Injectable({
  providedIn: 'root'
})
export class EnseignantService {
  private baseUrl = "http://localhost:8080/api/enseignants";

  constructor(private http: HttpClient) { }

  index(): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(this.baseUrl);
  }

  store(formData: FormData): Observable<Enseignant> {
    return this.http.post<Enseignant>(this.baseUrl, formData);
  }

  show(id: string): Observable<Enseignant> {
    return this.http.get<Enseignant>(`${this.baseUrl}/${id}`);
  }

  update(id: number, formData: FormData): Observable<Enseignant> {
    return this.http.put<Enseignant>(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}