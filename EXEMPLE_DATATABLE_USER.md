# Exemple d'intégration DataTable - Composant User

## 1. Modifier user.component.ts

```typescript
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
  imports: [
    CommonModule, 
    FormsModule, 
    PageBreadcrumbComponent, 
    InputFieldComponent, 
    LabelComponent, 
    ButtonComponent,
    DataTableComponent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  user: User = { active: true };
  users: User[] = [];
  roles: Role[] = [];
  public editMode: boolean = false;
  readonly emailPattern: string = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';

  // Configuration des colonnes pour DataTable
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
          return value[0].name || value[0];
        }
        return value?.name || value || '';
      }
    },
    { 
      key: 'active', 
      label: 'Statut', 
      sortable: true,
      render: (value: any) => {
        return value 
          ? '<span class="text-green-500">Actif</span>' 
          : '<span class="text-red-500">Inactif</span>';
      }
    },
    { key: 'actions', label: 'Actions', sortable: false, isAction: true }
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
    // ... votre code existant
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
    if (user.id === undefined) return;
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      this.service.delete(user.id).subscribe({
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

  // ... reste de votre code
}
```

## 2. Modifier user.component.html

Remplacez la section du tableau par :

```html
<!-- Table Section avec DataTable -->
<app-datatable
  [data]="users"
  [columns]="columns"
  title="Liste des Utilisateurs"
  fileName="utilisateurs"
  [showExportButtons]="true"
  [pageSize]="10"
  (onEdit)="onEdit($event)"
  (onDelete)="onDelete($event)">
  
  <!-- Template pour les actions -->
  <ng-template #actionTemplate let-user>
    <div class="flex items-center space-x-3.5">
      <button 
        (click)="onEdit(user)" 
        class="font-medium text-brand-500 hover:text-brand-600">
        Modifier
      </button>
      <button 
        (click)="onDelete(user)" 
        class="font-medium text-error-500 hover:text-error-600">
        Supprimer
      </button>
    </div>
  </ng-template>
</app-datatable>
```

**Note importante** : Pour utiliser le template d'actions, vous devez d'abord mettre à jour le composant DataTable pour accepter le template. Voici une version simplifiée sans template :

## Version simplifiée (sans template d'actions)

Si vous préférez une approche plus simple, vous pouvez utiliser le render pour les actions :

```typescript
columns: DataTableColumn[] = [
  // ... autres colonnes
  {
    key: 'id',
    label: 'Actions',
    sortable: false,
    render: (value: any, row: any) => {
      return `
        <button onclick="window.editUser_${row.id}()" class="font-medium text-brand-500 hover:text-brand-600 mr-2">Modifier</button>
        <button onclick="window.deleteUser_${row.id}()" class="font-medium text-error-500 hover:text-error-600">Supprimer</button>
      `;
    }
  }
];
```

Et dans ngOnInit :

```typescript
ngOnInit() {
  this.getUsers();
  this.getRoles();
  
  // Exposer les méthodes pour les boutons
  this.users.forEach(user => {
    if (user.id) {
      (window as any)[`editUser_${user.id}`] = () => this.onEdit(user);
      (window as any)[`deleteUser_${user.id}`] = () => this.onDelete(user);
    }
  });
}
```

Mais cette approche n'est pas idéale. La meilleure solution est d'améliorer le composant DataTable pour gérer les événements directement.



