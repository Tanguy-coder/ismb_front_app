import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { Ue } from "../models/ue";
import { HandleErrorsService } from "./handle-errors.service";

@Injectable({
  providedIn: 'root'
})
export class UeService {
  private baseUrl = "http://localhost:8080/api/ues";

  constructor(
    private http: HttpClient,
    private errorHandler: HandleErrorsService
  ) { }

  index(): Observable<Ue[]> {
    return this.http.get<Ue[]>(this.baseUrl).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  store(ue: Ue): Observable<Ue> {
    return this.http.post<Ue>(this.baseUrl, ue).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  update(id: number, ue: Ue): Observable<Ue> {
    return this.http.put<Ue>(`${this.baseUrl}/${id}`, ue).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }
}
