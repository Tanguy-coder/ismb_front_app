import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../models/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private apiUrl = '/api/notes'; // replace it with your API endpoint

  constructor(private http: HttpClient) { }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  getNote(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`);
  }

  addNotes(notes: Note[]): Observable<Note[]> {
    console.log(notes);
    return this.http.post<Note[]>(this.apiUrl, notes);
  }

  updateNote(note: Note[]): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}`, note);
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Retrieve notes with filters (annee, filiere, ue, session, periode)
  searchNotes(filters: {
    anneeId?: number;
    filiereId?: number;
    ueId?: number;
    session?: string;
    periode?: number;
  }): Observable<Note[]> {
    let params = new HttpParams();
    if (filters.anneeId != null) params = params.set('anneeId', String(filters.anneeId));
    if (filters.filiereId != null) params = params.set('filiereId', String(filters.filiereId));
    if (filters.ueId != null) params = params.set('ueId', String(filters.ueId));
    if (filters.session != null) params = params.set('session', filters.session);
    if (filters.periode != null) params = params.set('periode', String(filters.periode));

    return this.http.get<Note[]>(this.apiUrl, { params });
  }
}
