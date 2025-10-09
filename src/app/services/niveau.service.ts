import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Niveau } from "../models/niveau";
import { catchError, Observable } from "rxjs";
import { HandleErrorsService } from "./handle-errors.service";

@Injectable({
  providedIn: 'root'
})
export class NiveauService {
  baseUrl: string = 'http://localhost:8080/api/niveaus'; 

  constructor(
      private http: HttpClient,
      private errorHandler: HandleErrorsService
  ) { }

  index(): Observable<Niveau[]> {
    return this.http.get<Niveau[]>(this.baseUrl).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  store(niveau: Niveau): Observable<Niveau> {
    return this.http.post<Niveau>(this.baseUrl, niveau).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  show(id: number): Observable<Niveau> {
    return this.http.get<Niveau>(`${this.baseUrl}/${id}`).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  update(id: number, niveau: Niveau): Observable<Niveau> {
    console.log(id, niveau);
    return this.http.put<Niveau>(`${this.baseUrl}/${id}`, niveau).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }
}
