import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../models/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private apiUrl = 'http://localhost:8080/api/notes'; // replace with your API endpoint

  constructor(private http: HttpClient) { }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  getNote(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`);
  }

  addNote(note: Note): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note);
  }

  addNotes(notes: Note[]): Observable<Note[]> {
    return this.http.post<Note[]>(`${this.apiUrl}/bulk`, notes);
  }

  updateNote(id: number, note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${id}`, note);
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
