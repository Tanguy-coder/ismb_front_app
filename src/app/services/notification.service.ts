
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'warning' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();

  public notification$: Observable<Notification> = this.notificationSubject.asObservable();

  constructor() { }

  showSuccess(message: string) {
    this.notificationSubject.next({ message, type: 'success' });
  }

  showWarning(message: string) {
    this.notificationSubject.next({ message, type: 'warning' });
  }

  showError(message: string) {
    this.notificationSubject.next({ message, type: 'error' });
  }
}
