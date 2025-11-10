import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { Enseignant } from "../models/enseignant";
import { HandleErrorsService } from "./handle-errors.service";

@Injectable({
  providedIn: 'root'
})
export class EnseignantService {
  private baseUrl = "http://localhost:8080/api/enseignants";

  constructor(
    private http: HttpClient,
    private errorHandler: HandleErrorsService
  ) { }

  index(): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(this.baseUrl).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  store(formData: FormData): Observable<Enseignant> {
    return this.http.post<Enseignant>(this.baseUrl, formData).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  show(id: string): Observable<Enseignant> {
    return this.http.get<Enseignant>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  update(id: number, formData: FormData): Observable<Enseignant> {
    return this.http.put<Enseignant>(`${this.baseUrl}/${id}`, formData).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }
}