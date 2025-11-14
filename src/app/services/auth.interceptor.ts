import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HandleErrorsService } from './handle-errors.service';

/**
 * Intercepteur HTTP pour:
 * 1. Ajouter automatiquement le token JWT aux requêtes
 * 2. Gérer les erreurs d'authentification (401)
 * 3. Rediriger vers la page de connexion si nécessaire
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const errorHandler = inject(HandleErrorsService);

  // Récupérer le token
  const token = authService.getToken();

  // Cloner la requête et ajouter le token si disponible
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Envoyer la requête et gérer les erreurs
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Gestion spéciale pour les erreurs 401 (non autorisé)
      if (error.status === 401) {
        // Déconnecter l'utilisateur et rediriger vers la page de connexion
        authService.logout();
        // Ne pas afficher de notification car la redirection suffit
        return throwError(() => ({
          message: 'Session expirée. Veuillez vous reconnecter.',
          status: error.status,
          details: null,
          originalError: error
        }));
      }

      // Pour les autres erreurs, utiliser le gestionnaire d'erreurs standard
      return errorHandler.handleError(error);
    })
  );
};
