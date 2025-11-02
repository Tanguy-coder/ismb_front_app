import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Matiere } from "../models/matiere";
import { catchError, Observable } from "rxjs";
import { HandleErrorsService } from "./handle-errors.service";

@Injectable({
  providedIn: 'root'
})
export class MatiereService {
  baseUrl: string = 'http://localhost:8080/api/matieres';

  constructor(
      private http: HttpClient,
      private errorHandler: HandleErrorsService
  ) { }

  index(): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(this.baseUrl).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  store(matiere: Matiere): Observable<Matiere> {
    return this.http.post<Matiere>(this.baseUrl, matiere).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  show(id: number): Observable<Matiere> {
    return this.http.get<Matiere>(`${this.baseUrl}/${id}`).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  update(id: number, matiere: Matiere): Observable<Matiere> {
    return this.http.put<Matiere>(`${this.baseUrl}/${id}`, matiere).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }
}
