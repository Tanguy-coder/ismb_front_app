import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../../services/permission.service';
import { Permission } from '../../../models/permission';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { NotificationService } from "../../../services/notification.service";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent, InputFieldComponent, LabelComponent, ButtonComponent],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css'
})
export class PermissionComponent implements OnInit {
  permission: Permission = new Permission();
  permissions: Permission[] = [];
  allPermissions: Permission[] = [];
  public editMode: boolean = false;
  public searchTerm: string = '';

  constructor(
      private service: PermissionService,
      private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.getPermissions();
  }

  private validateForm(): boolean {
    if (!this.permission.name) {
      this.notificationService.showWarning("Veuillez renseigner le nom de la permission.");
      return false;
    }
    return true;
  }

  getPermissions(): void {
    this.service.index().subscribe({
      next: (response: Permission[]) => {
        this.allPermissions = response;
        this.permissions = response;
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.permissions = this.allPermissions;
      return;
    }
    this.permissions = this.allPermissions.filter(permission =>
        permission.name && permission.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    const operation = this.editMode
        ? this.service.update(this.permission.id!, this.permission)
        : this.service.store(this.permission);

    const successMessage = this.editMode
        ? "Permission mise à jour avec succès !"
        : "Permission créée avec succès !";

    operation.subscribe({
      next: () => {
        this.notificationService.showSuccess(successMessage);
        this.getPermissions();
        this.resetForm();
      }
    });
  }

  onEdit(permission: Permission): void {
    this.editMode = true;
    this.permission = { ...permission };
  }

  onDelete(id: number | undefined): void {
    if (id === undefined) return;
    if (confirm("Voulez-vous vraiment supprimer cette permission ?")) {
      this.service.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess("Permission supprimée avec succès !");
          this.getPermissions();
          this.resetForm();
        }
      });
    }
  }

  resetForm(): void {
    this.permission = new Permission();
    this.editMode = false;
  }
}
