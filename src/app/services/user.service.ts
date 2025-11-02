import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { User } from "../models/user";
import { HandleErrorsService } from "./handle-errors.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = "http://localhost:8080/api/users";

  constructor(
    private http: HttpClient,
    private errorHandler: HandleErrorsService
  ) { }

  index(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  store(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  show(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => this.errorHandler.handleError(error))
    );
  }
}