import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { NotificationService } from "../../../services/notification.service";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { Role } from '../../../models/role';
import { RoleService } from '../../../services/role.service';
import { DataTableComponent, DataTableColumn } from '../../../shared/components/datatable/datatable.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent, InputFieldComponent, LabelComponent, ButtonComponent, DataTableComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  user: User = { active: true };
  users: User[] = [];
  roles: Role[] = [];
  public editMode: boolean = false;
  readonly emailPattern: string = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';

  columns: DataTableColumn[] = [
    { key: 'nom', label: 'Nom', sortable: true },
    { key: 'prenom', label: 'Prénom', sortable: true },
    { key: 'username', label: 'Username', sortable: true },
    { key: 'contact', label: 'Contact', sortable: false },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'roles',
      label: 'Rôle',
      sortable: false,
      render: (value: any) => {
        if (Array.isArray(value) && value.length > 0) {
          return value[0]?.name ?? String(value[0] ?? '');
        }
        return value?.name ?? String(value ?? '');
      }
    },
    {
      key: 'active',
      label: 'Actif',
      sortable: true,
      render: (value: any) =>
        value ? '<span class="text-green-500">Actif</span>' : '<span class="text-red-500">Inactif</span>',
    },
    { key: 'actions', label: 'Actions', sortable: false, isAction: true },
  ];

  constructor(
      private service: UserService,
      private roleService: RoleService,
      private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.getUsers();
    this.getRoles();
  }

  private validateForm(): boolean {
    if (!this.user.nom || !this.user.prenom || !this.user.username || !this.user.contact || !this.user.email || !this.user.roles) {
      this.notificationService.showWarning("Veuillez renseigner les champs obligatoires.");
      return false;
    }
    if (!this.isValidEmail(this.user.email)) {
      this.notificationService.showWarning("Veuillez renseigner un email valide.");
      return false;
    }
    if (!this.editMode && !this.user.password) {
        this.notificationService.showWarning("Veuillez renseigner le mot de passe.");
        return false;
    }
    return true;
  }

  getUsers(): void {
    this.service.index().subscribe({
      next: (response: User[]) => {
        this.users = response;
      }
    });
  }

  getRoles(): void {
    this.roleService.index().subscribe({
      next: (response: Role[]) => {
        this.roles = response;
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    const userToSend: any = { ...this.user };
    if (userToSend.roles && !Array.isArray(userToSend.roles)) {
      userToSend.roles = [userToSend.roles];
    }

    const operation = this.editMode
        ? this.service.update(userToSend.id!, userToSend)
        : this.service.store(userToSend);

    const successMessage = this.editMode
        ? "Utilisateur mis à jour avec succès !"
        : "Utilisateur créé avec succès !";

    operation.subscribe({
      next: (response) => {
        console.log('User operation successful:', response);
        // Afficher la notification immédiatement
        this.notificationService.showSuccess(successMessage);
        // Utiliser setTimeout pour s'assurer que la notification est affichée avant les autres opérations
        setTimeout(() => {
          this.getUsers();
          this.resetForm();
        }, 50);
      },
      error: (err) => {
        console.error('Error during user submission:', err);
        // Afficher une notification d'erreur avec plus de détails
        const errorMessage = err?.message || err?.error?.message || 'Une erreur est survenue.';
        this.notificationService.showError(errorMessage);
      }
    });
  }

  onEdit(user: User): void {
    this.editMode = true;
    const userToEdit: any = { ...user };
    if (userToEdit.roles && Array.isArray(userToEdit.roles)) {
      userToEdit.roles = userToEdit.roles[0];
    }
    this.user = userToEdit;
  }

  onDelete(user: User): void {
    if (user?.id === undefined) return;
    this.service.delete(user.id).subscribe({
      next: () => {
        this.notificationService.showSuccess("Utilisateur supprimé avec succès !");
        this.getUsers();
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    this.user = { active: true };
    this.editMode = false;
  }

  private isValidEmail(email: string | null | undefined): boolean {
    return !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
