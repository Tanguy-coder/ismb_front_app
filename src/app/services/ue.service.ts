import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Ue } from "../models/ue";

@Injectable({
  providedIn: 'root'
})
export class UeService {
  private baseUrl = "/api/ues";

  constructor(private http: HttpClient) { }

  index(): Observable<Ue[]> {
    return this.http.get<Ue[]>(this.baseUrl);
  }

  store(ue: Ue): Observable<Ue> {
    return this.http.post<Ue>(this.baseUrl, ue);
  }

  update(id: number, ue: Ue): Observable<Ue> {
    return this.http.put<Ue>(`${this.baseUrl}/${id}`, ue);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
