import { Component, Input } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports:[CommonModule,RouterModule,DropdownComponent,DropdownItemTwoComponent]
})
export class UserDropdownComponent {
  @Input() user: User | null = null;
  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  getDisplayName(): string {
    if (!this.user) return 'Utilisateur';
    if (this.user.prenom) return this.user.prenom;
    if (this.user.username) return this.user.username;
    return 'Utilisateur';
  }

  getFullName(): string {
    if (!this.user) return 'Utilisateur';
    if (this.user.nom && this.user.prenom) {
      return `${this.user.prenom} ${this.user.nom}`;
    }
    if (this.user.username) return this.user.username;
    return 'Utilisateur';
  }

  getEmail(): string {
    return this.user?.email || 'email@exemple.com';
  }

  getInitials(): string {
    if (!this.user) return 'U';
    
    if (this.user.prenom && this.user.nom) {
      return `${this.user.prenom.charAt(0)}${this.user.nom.charAt(0)}`.toUpperCase();
    }
    
    if (this.user.username && this.user.username.length > 0) {
      return this.user.username.charAt(0).toUpperCase();
    }
    
    return 'U';
  }

  getAvatarColor(): string {
    if (!this.user) return '#6366f1';
    
    // Génère une couleur basée sur le nom de l'utilisateur
    const name = this.user.username || this.user.email || 'default';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Palette de couleurs agréables
    const colors = [
      '#6366f1', // indigo
      '#8b5cf6', // violet
      '#ec4899', // pink
      '#f59e0b', // amber
      '#10b981', // emerald
      '#06b6d4', // cyan
      '#3b82f6', // blue
      '#f97316', // orange
    ];
    
    return colors[Math.abs(hash) % colors.length];
  }
}
