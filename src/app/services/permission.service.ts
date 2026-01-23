import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Permission } from "../models/permission";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  baseUrl: string = '/api/permissions';

  constructor(private http: HttpClient) { }

  index(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.baseUrl);
  }

  store(permission: Permission): Observable<Permission> {
    return this.http.post<Permission>(this.baseUrl, permission);
  }

  show(id: number): Observable<Permission> {
    return this.http.get<Permission>(`${this.baseUrl}/${id}`);
  }

  update(id: number, permission: Permission): Observable<Permission> {
    return this.http.put<Permission>(`${this.baseUrl}/${id}`, permission);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
