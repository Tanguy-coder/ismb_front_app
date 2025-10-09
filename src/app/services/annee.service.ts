import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AnneeScolaire} from "../models/annee-scolaire";
import {catchError, Observable} from "rxjs";
import {HandleErrorsService} from "./handle-errors.service";

@Injectable({
  providedIn: 'root'
})
export class AnneeService {
  baseUrl: string = 'http://localhost:8080/api/annees';
  constructor(
      private http: HttpClient,
      private errorHandler: HandleErrorsService
  ) { }

  index(): Observable<AnneeScolaire[]> {
    return this.http.get<AnneeScolaire[]>(this.baseUrl).pipe(
        catchError((error) =>this.errorHandler.handleError(error))
    );
  }

  store(annee: AnneeScolaire): Observable<AnneeScolaire> {
    return this.http.post<AnneeScolaire>(this.baseUrl, annee).pipe(
        catchError((error) =>this.errorHandler.handleError(error))
    );
  }

  show(id:number):Observable<AnneeScolaire> {
    return this.http.get<AnneeScolaire>(`${this.baseUrl}/${id}`).pipe(
        catchError((error) =>this.errorHandler.handleError(error))
    );
  }

  update(id:number, annee:AnneeScolaire):Observable<AnneeScolaire> {
    console.log(id, annee);
    return this.http.put<AnneeScolaire>(`${this.baseUrl}/${id}`, annee).pipe(
        catchError((error) =>this.errorHandler.handleError(error))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
        catchError((error) =>this.errorHandler.handleError(error))
    );
  }
}
