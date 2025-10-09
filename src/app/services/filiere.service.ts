import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Filiere } from "../models/filiere";
import { catchError, Observable } from "rxjs";
import { HandleErrorsService } from "./handle-errors.service";

@Injectable({
  providedIn: 'root'
})
export class FiliereService {
  baseUrl: string = 'http://localhost:8080/api/filieres';

  constructor(
      private http: HttpClient,
      private errorHandler: HandleErrorsService
  ) { }

  index(): Observable<Filiere[]> {
    return this.http.get<Filiere[]>(this.baseUrl).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  store(filiere: Filiere): Observable<Filiere> {
    return this.http.post<Filiere>(this.baseUrl, filiere).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  show(id: number): Observable<Filiere> {
    return this.http.get<Filiere>(`${this.baseUrl}/${id}`).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  update(id: number, filiere: Filiere): Observable<Filiere> {
    console.log(id, filiere);
    return this.http.put<Filiere>(`${this.baseUrl}/${id}`, filiere).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }
}
