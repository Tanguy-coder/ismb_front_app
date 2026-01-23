
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  duration?: number; // Durée en millisecondes (optionnel)
  id?: string; // ID unique pour la notification
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();

  public notification$: Observable<Notification> = this.notificationSubject.asObservable();

  constructor() { }

  /**
   * Affiche une notification de succès
   * @param message Le message à afficher
   * @param duration Durée d'affichage en ms (par défaut: 5000)
   */
  showSuccess(message: string, duration: number = 5000): void {
    this.notificationSubject.next({ 
      message, 
      type: 'success', 
      duration,
      id: this.generateId()
    });
  }

  /**
   * Affiche une notification d'avertissement
   * @param message Le message à afficher
   * @param duration Durée d'affichage en ms (par défaut: 7000)
   */
  showWarning(message: string, duration: number = 7000): void {
    this.notificationSubject.next({ 
      message, 
      type: 'warning', 
      duration,
      id: this.generateId()
    });
  }

  /**
   * Affiche une notification d'erreur
   * @param message Le message à afficher
   * @param duration Durée d'affichage en ms (par défaut: 10000)
   */
  showError(message: string, duration: number = 10000): void {
    this.notificationSubject.next({ 
      message, 
      type: 'error', 
      duration,
      id: this.generateId()
    });
  }

  /**
   * Affiche une notification d'information
   * @param message Le message à afficher
   * @param duration Durée d'affichage en ms (par défaut: 5000)
   */
  showInfo(message: string, duration: number = 5000): void {
    this.notificationSubject.next({ 
      message, 
      type: 'info', 
      duration,
      id: this.generateId()
    });
  }

  /**
   * Génère un ID unique pour chaque notification
   */
  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}
