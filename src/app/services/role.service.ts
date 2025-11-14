import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Role } from "../models/role";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  baseUrl: string = 'http://localhost:8080/api/roles';

  constructor(private http: HttpClient) { }

  index(): Observable<Role[]> {
    return this.http.get<Role[]>(this.baseUrl);
  }

  store(role: Role): Observable<Role> {
    return this.http.post<Role>(this.baseUrl, role);
  }

  show(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.baseUrl}/${id}`);
  }

  update(id: number, role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.baseUrl}/${id}`, role);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
