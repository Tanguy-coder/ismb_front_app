import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ListeService {
  baseUrl: string = '/api/listes';
  constructor(private http: HttpClient) { }
}
