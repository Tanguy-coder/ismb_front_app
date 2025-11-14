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

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent, InputFieldComponent, LabelComponent, ButtonComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  user: User = { active: true };
  users: User[] = [];
  allUsers: User[] = [];
  roles: Role[] = [];
  public editMode: boolean = false;
  public searchTerm: string = '';
  readonly emailPattern: string = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';

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
        this.allUsers = response;
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

  onSearch(): void {
    if (!this.searchTerm) {
      this.users = this.allUsers;
      return;
    }
    this.users = this.allUsers.filter(user =>
        (user.nom && user.nom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (user.prenom && user.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (user.username && user.username.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
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
      next: () => {
        this.notificationService.showSuccess(successMessage);
        this.getUsers();
        this.resetForm();
      },
      error: (err) => {
        console.error('Error during user submission:', err);
        this.notificationService.showError('Une erreur est survenue.');
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

  onDelete(id: number | undefined): void {
    if (id === undefined) return;
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      this.service.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess("Utilisateur supprimé avec succès !");
          this.getUsers();
          this.resetForm();
        }
      });
    }
  }

  resetForm(): void {
    this.user = { active: true };
    this.editMode = false;
  }

  private isValidEmail(email: string | null | undefined): boolean {
    return !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
