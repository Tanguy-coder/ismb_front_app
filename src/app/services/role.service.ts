import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Role } from "../models/role";
import { catchError, Observable } from "rxjs";
import { HandleErrorsService } from "./handle-errors.service";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  baseUrl: string = 'http://localhost:8080/api/roles';

  constructor(
      private http: HttpClient,
      private errorHandler: HandleErrorsService
  ) { }

  index(): Observable<Role[]> {
    return this.http.get<Role[]>(this.baseUrl).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  store(role: Role): Observable<Role> {
    return this.http.post<Role>(this.baseUrl, role).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  show(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.baseUrl}/${id}`).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  update(id: number, role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.baseUrl}/${id}`, role).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }
}
