import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth/login';
  private tokenKey = 'auth_token';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /**
   * Authentifie un utilisateur avec ses identifiants
   * @param credentials Nom d'utilisateur et mot de passe
   * @returns Observable de la réponse d'authentification
   */
  login(credentials: {username: string, password: string}): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          this.router.navigate(['/']);
        }
      })
    );
  }

  /**
   * Déconnecte l'utilisateur et le redirige vers la page de connexion
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/signin']);
  }

  /**
   * Récupère le token JWT stocké
   * @returns Le token ou null s'il n'existe pas
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns true si un token existe, false sinon
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
}
