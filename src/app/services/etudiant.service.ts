import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { Etudiant } from "../models/etudiant";
import { HandleErrorsService } from "./handle-errors.service";

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  private baseUrl = "http://localhost:8080/api/etudiants";

  constructor(
    private http: HttpClient,
    private errorHandler: HandleErrorsService
  ) { }

  index(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(this.baseUrl).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  store(formData: FormData): Observable<Etudiant> {
    return this.http.post<Etudiant>(this.baseUrl, formData).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  show(id: string): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  update(id: number, formData: FormData): Observable<Etudiant> {
    return this.http.put<Etudiant>(`${this.baseUrl}/${id}`, formData).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }
}