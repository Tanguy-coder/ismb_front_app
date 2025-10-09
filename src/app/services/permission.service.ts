import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Permission } from "../models/permission";
import { catchError, Observable } from "rxjs";
import { HandleErrorsService } from "./handle-errors.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  baseUrl: string = 'http://localhost:8080/api/permissions';

  constructor(
      private http: HttpClient,
      private errorHandler: HandleErrorsService
  ) { }

  index(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.baseUrl).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  store(permission: Permission): Observable<Permission> {
    return this.http.post<Permission>(this.baseUrl, permission).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  show(id: number): Observable<Permission> {
    return this.http.get<Permission>(`${this.baseUrl}/${id}`).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  update(id: number, permission: Permission): Observable<Permission> {
    return this.http.put<Permission>(`${this.baseUrl}/${id}`, permission).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
        catchError((error) => this.errorHandler.handleError(error))
    );
  }
}
