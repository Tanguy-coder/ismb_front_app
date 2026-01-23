import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Filiere } from "../models/filiere";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FiliereService {
  baseUrl: string = '/api/filieres';

  constructor(private http: HttpClient) { }

  index(): Observable<Filiere[]> {
    return this.http.get<Filiere[]>(this.baseUrl);
  }

  store(filiere: Filiere): Observable<Filiere> {
    return this.http.post<Filiere>(this.baseUrl, filiere);
  }

  show(id: number): Observable<Filiere> {
    return this.http.get<Filiere>(`${this.baseUrl}/${id}`);
  }

  update(id: number, filiere: Filiere): Observable<Filiere> {
    console.log(id, filiere);
    return this.http.put<Filiere>(`${this.baseUrl}/${id}`, filiere);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
