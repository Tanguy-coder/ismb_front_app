import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../../services/role.service';
import { Role } from '../../../models/role';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { NotificationService } from "../../../services/notification.service";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { Permission } from '../../../models/permission';
import { PermissionService } from '../../../services/permission.service';
import { DataTableComponent, DataTableColumn } from '../../../shared/components/datatable/datatable.component';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent, InputFieldComponent, LabelComponent, ButtonComponent, DataTableComponent],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit {
  role: Role = new Role();
  roles: Role[] = [];
  permissions: Permission[] = [];
  public editMode: boolean = false;

  columns: DataTableColumn[] = [
    { key: 'name', label: 'Nom', sortable: true },
    { 
      key: 'permissions', 
      label: 'Permissions', 
      sortable: false,
      render: (value: any, row: any) => {
        if (!row.permissions || row.permissions.length === 0) return '';
        return row.permissions.map((p: any) => 
          `<span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">${p.name}</span>`
        ).join('');
      }
    },
    { key: 'actions', label: 'Actions', sortable: false, isAction: true }
  ];

  constructor(
    private service: RoleService,
    private permissionService: PermissionService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.getRoles();
    this.getPermissions();
    this.role.permissions = [];
  }

  private validateForm(): boolean {
    if (!this.role.name) {
      this.notificationService.showWarning("Veuillez renseigner le nom du rôle.");
      return false;
    }
    return true;
  }

  getRoles(): void {
    this.service.index().subscribe({
      next: (response: Role[]) => {
        this.roles = response;
      }
    });
  }

  getPermissions(): void {
    this.permissionService.index().subscribe({
      next: (response: Permission[]) => {
        this.permissions = response;
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    const operation = this.editMode
      ? this.service.update(this.role.id!, this.role)
      : this.service.store(this.role);

    const successMessage = this.editMode
      ? "Rôle mis à jour avec succès !"
      : "Rôle créé avec succès !";

    operation.subscribe({
      next: () => {
        this.notificationService.showSuccess(successMessage);
        this.getRoles();
        this.resetForm();
      }
    });
  }

  onEdit(role: Role): void {
    this.editMode = true;
    this.role = { ...role };
    if (!this.role.permissions) {
      this.role.permissions = [];
    }
  }

  onDelete(role: Role): void {
    if (role.id === undefined) return;
    this.service.delete(role.id).subscribe({
      next: () => {
        this.notificationService.showSuccess("Rôle supprimé avec succès !");
        this.getRoles();
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    this.role = new Role();
    this.role.permissions = [];
    this.editMode = false;
  }

  onPermissionChange(permission: Permission, event: any): void {
    if (event.target.checked) {
      this.role.permissions?.push(permission);
    } else {
      this.role.permissions = this.role.permissions?.filter(p => {
        if (p.id && permission.id) return p.id !== permission.id;
        return p.name !== permission.name;
      });
    }
  }

  isPermissionSelected(permission: Permission): boolean {
    return this.role.permissions?.some(p => {
      if (p.id && permission.id) return p.id === permission.id;
      return p.name === permission.name;
    }) || false;
  }
}
