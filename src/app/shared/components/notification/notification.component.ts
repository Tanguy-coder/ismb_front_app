import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Notification, NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe(
      (notification) => {
        // Créer un nouveau tableau pour forcer la détection de changement
        this.notifications = [...this.notifications, notification];
        // Forcer la détection de changement immédiatement
        this.cdr.detectChanges();
        // Auto-dismiss après la durée spécifiée ou 10 secondes par défaut
        const duration = notification.duration || 10000;
        setTimeout(() => this.close(notification), duration);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  close(notification: Notification): void {
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
    // Forcer la détection de changement après suppression
    this.cdr.detectChanges();
  }

  /**
   * Retourne les classes CSS appropriées selon le type de notification
   */
  getNotificationClass(notification: Notification): string {
    switch (notification.type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'info':
        return 'bg-blue-100 border-blue-400 text-blue-700';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-700';
    }
  }

  /**
   * Retourne l'icône appropriée selon le type de notification
   */
  getNotificationIcon(notification: Notification): string {
    switch (notification.type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  }
}
