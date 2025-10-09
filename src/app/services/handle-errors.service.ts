import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from "rxjs";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class HandleErrorsService {

  constructor(private notificationService: NotificationService) {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue.';

    if (error.error instanceof ErrorEvent) {
      // ⚠️ Erreur côté client (connexion, requête annulée, etc.)
      console.error('Erreur côté client :', error.error.message);
      errorMessage = `Erreur réseau : ${error.error.message}`;
    } else {
      // ⚙️ Erreur côté serveur
      console.error('Erreur côté serveur :', {
        status: error.status,
        message: error.message,
        body: error.error
      });

      // Essayer d'extraire un message d'erreur spécifique du backend
      if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error && error.error.message && typeof error.error.message === 'string') {
        errorMessage = error.error.message;
      } else if (error.error && error.error.error && typeof error.error.error === 'string') {
        errorMessage = error.error.error;
      } else {
        // Sinon, utiliser les messages génériques basés sur le statut
        switch (error.status) {
          case 0:
            errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion Internet.';
            break;
          case 400:
            errorMessage = 'Requête invalide (400) : les données envoyées sont incorrectes.';
            break;
          case 401:
            errorMessage = 'Non autorisé (401) : veuillez vous reconnecter.';
            break;
          case 403:
            errorMessage = 'Accès refusé (403) : vous n’avez pas les permissions nécessaires.';
            break;
          case 404:
            errorMessage = 'Ressource introuvable (404).';
            break;
          case 409:
            errorMessage = 'Conflit : la ressource existe déjà ou ne peut être modifiée (409).';
            break;
          case 422:
            errorMessage = 'Erreur de validation des données (422).';
            break;
          case 500:
            errorMessage = 'Erreur interne du serveur (500).';
            break;
          default:
            errorMessage = `Erreur inattendue (code ${error.status}). Contactez le support si le problème persiste.`;
            break;
        }
      }
    }

    // Affiche la notification d'erreur à l'utilisateur
    this.notificationService.showError(errorMessage);

    // Retourne un flux d’erreur pour le composant ou le service appelant
    return throwError(() => new Error(errorMessage));
  }
}
