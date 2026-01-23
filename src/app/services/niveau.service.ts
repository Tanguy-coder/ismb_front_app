import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Niveau } from "../models/niveau";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NiveauService {
  baseUrl: string = '/api/niveaus'; 

  constructor(private http: HttpClient) { }

  index(): Observable<Niveau[]> {
    return this.http.get<Niveau[]>(this.baseUrl);
  }

  store(niveau: Niveau): Observable<Niveau> {
    return this.http.post<Niveau>(this.baseUrl, niveau);
  }

  show(id: number): Observable<Niveau> {
    return this.http.get<Niveau>(`${this.baseUrl}/${id}`);
  }

  update(id: number, niveau: Niveau): Observable<Niveau> {
    console.log(id, niveau);
    return this.http.put<Niveau>(`${this.baseUrl}/${id}`, niveau);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
