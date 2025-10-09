import { Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe(
      (notification) => {
        this.notifications.push(notification);
        // Auto-dismiss after 10 seconds
        setTimeout(() => this.close(notification), 10000);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  close(notification: Notification): void {
    this.notifications = this.notifications.filter(n => n !== notification);
  }

  // Method to get CSS classes based on notification type
  getNotificationClass(notification: Notification): string {
    switch (notification.type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-700';
    }
  }
}
