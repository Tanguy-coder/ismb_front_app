import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { Etablissement } from "../models/etablissement";
import { HandleErrorsService } from "./handle-errors.service";

@Injectable({
  providedIn: 'root'
})
export class EtablissementService {
  private baseUrl = "http://localhost:8080/api/etablissements";

  constructor(
    private http: HttpClient,
    private errorHandler: HandleErrorsService
  ) { }

  index(): Observable<Etablissement[]> {
    return this.http.get<Etablissement[]>(this.baseUrl).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  store(formData: FormData): Observable<Etablissement> {
    return this.http.post<Etablissement>(this.baseUrl, formData).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  show(id: string): Observable<Etablissement> {
    return this.http.get<Etablissement>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  update(id: number, formData: FormData): Observable<Etablissement> {
    return this.http.put<Etablissement>(`${this.baseUrl}/${id}`, formData).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }
}
