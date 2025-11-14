import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from "rxjs";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class HandleErrorsService {

  constructor(private notificationService: NotificationService) {}

  /**
   * Gère les erreurs HTTP et affiche des notifications appropriées
   * @param error L'erreur HTTP reçue
   * @param showNotification Si false, n'affiche pas de notification (par défaut: true)
   * @returns Observable d'erreur
   */
  handleError(error: HttpErrorResponse, showNotification: boolean = true): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue.';
    let errorDetails: any = null;

    if (error.error instanceof ErrorEvent) {
      // ⚠️ Erreur côté client (connexion, requête annulée, etc.)
      console.error('Erreur côté client :', error.error.message);
      errorMessage = `Erreur réseau : ${error.error.message}`;
    } else {
      // ⚙️ Erreur côté serveur
      console.error('Erreur côté serveur :', {
        status: error.status,
        message: error.message,
        body: error.error,
        url: error.url
      });

      // Extraire le message d'erreur du backend
      errorMessage = this.extractErrorMessage(error);
      errorDetails = this.extractErrorDetails(error);
    }

    // Affiche la notification d'erreur à l'utilisateur si demandé
    if (showNotification) {
      this.notificationService.showError(errorMessage);
    }

    // Retourne un flux d'erreur avec les détails
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      details: errorDetails,
      originalError: error
    }));
  }

  /**
   * Extrait le message d'erreur de la réponse HTTP
   */
  private extractErrorMessage(error: HttpErrorResponse): string {
    // Cas 1: Message direct en string
    if (error.error && typeof error.error === 'string') {
      return error.error;
    }

    // Cas 2: Objet avec propriété 'message'
    if (error.error?.message && typeof error.error.message === 'string') {
      return error.error.message;
    }

    // Cas 3: Objet avec propriété 'error'
    if (error.error?.error && typeof error.error.error === 'string') {
      return error.error.error;
    }

    // Cas 4: Erreurs de validation (422) avec détails
    if (error.status === 422 && error.error?.errors) {
      return this.formatValidationErrors(error.error.errors);
    }

    // Cas 5: Messages génériques basés sur le statut HTTP
    return this.getDefaultErrorMessage(error.status);
  }

  /**
   * Extrait les détails d'erreur supplémentaires
   */
  private extractErrorDetails(error: HttpErrorResponse): any {
    if (error.error?.errors) {
      return error.error.errors;
    }
    if (error.error?.details) {
      return error.error.details;
    }
    return null;
  }

  /**
   * Formate les erreurs de validation en un message lisible
   */
  private formatValidationErrors(errors: any): string {
    if (typeof errors === 'string') {
      return errors;
    }

    if (Array.isArray(errors)) {
      return errors.join(', ');
    }

    if (typeof errors === 'object') {
      const messages: string[] = [];
      for (const [field, fieldErrors] of Object.entries(errors)) {
        if (Array.isArray(fieldErrors)) {
          messages.push(`${field}: ${fieldErrors.join(', ')}`);
        } else if (typeof fieldErrors === 'string') {
          messages.push(`${field}: ${fieldErrors}`);
        }
      }
      return messages.length > 0 
        ? messages.join(' | ') 
        : 'Erreur de validation des données.';
    }

    return 'Erreur de validation des données.';
  }

  /**
   * Retourne un message d'erreur par défaut basé sur le code HTTP
   */
  private getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 0:
        return 'Impossible de se connecter au serveur. Vérifiez votre connexion Internet.';
      case 400:
        return 'Requête invalide : les données envoyées sont incorrectes.';
      case 401:
        return 'Non autorisé : veuillez vous reconnecter.';
      case 403:
        return 'Accès refusé : vous n\'avez pas les permissions nécessaires.';
      case 404:
        return 'Ressource introuvable.';
      case 409:
        return 'Conflit : la ressource existe déjà ou ne peut être modifiée.';
      case 422:
        return 'Erreur de validation des données.';
      case 500:
        return 'Erreur interne du serveur.';
      case 502:
        return 'Passerelle incorrecte : le serveur est temporairement indisponible.';
      case 503:
        return 'Service indisponible : le serveur est en maintenance.';
      case 504:
        return 'Délai d\'attente dépassé : le serveur met trop de temps à répondre.';
      default:
        return `Erreur inattendue (code ${status}). Contactez le support si le problème persiste.`;
    }
  }
}
