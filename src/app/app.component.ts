import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from "./shared/components/notification/notification.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    NotificationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'School Manager';
}
