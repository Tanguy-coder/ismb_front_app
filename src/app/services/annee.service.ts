import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AnneeScolaire } from "../models/annee-scolaire";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AnneeService {
  baseUrl: string = 'http://localhost:8080/api/annees';
  constructor(private http: HttpClient) { }

  index(): Observable<AnneeScolaire[]> {
    return this.http.get<AnneeScolaire[]>(this.baseUrl);
  }

  store(annee: AnneeScolaire): Observable<AnneeScolaire> {
    return this.http.post<AnneeScolaire>(this.baseUrl, annee);
  }

  show(id: number): Observable<AnneeScolaire> {
    return this.http.get<AnneeScolaire>(`${this.baseUrl}/${id}`);
  }

  update(id: number, annee: AnneeScolaire): Observable<AnneeScolaire> {
    console.log(id, annee);
    return this.http.put<AnneeScolaire>(`${this.baseUrl}/${id}`, annee);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
