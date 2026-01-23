# Guide d'intégration DataTable avec Export Excel/PDF

Ce guide explique comment intégrer le composant DataTable réutilisable avec fonctionnalités d'export dans tous vos tableaux.

## Composants créés

1. **ExportService** (`src/app/services/export.service.ts`) : Service pour exporter en Excel et PDF
2. **DataTableComponent** (`src/app/shared/components/datatable/datatable.component.ts`) : Composant réutilisable de tableau

## Exemple d'utilisation - Composant User

### 1. Importer le composant dans votre composant TypeScript

```typescript
import { DataTableComponent, DataTableColumn } from '../../../shared/components/datatable/datatable.component';

// Définir les colonnes
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
      return value ? '<span class="text-green-500">Actif</span>' : '<span class="text-red-500">Inactif</span>';
    }
  },
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    render: (value: any, row: any) => {
      return `
        <button onclick="window.editUser(${row.id})" class="font-medium text-brand-500 hover:text-brand-600">Modifier</button>
        <button onclick="window.deleteUser(${row.id})" class="font-medium text-error-500 hover:text-error-600">Supprimer</button>
      `;
    }
  }
];
```

### 2. Utiliser le composant dans le template HTML

Remplacez votre tableau existant par :

```html
<app-datatable
  [data]="users"
  [columns]="columns"
  title="Liste des Utilisateurs"
  fileName="utilisateurs"
  [showExportButtons]="true"
  [pageSize]="10">
</app-datatable>
```

### 3. Pour les actions (Modifier/Supprimer), utilisez des événements

Si vous avez besoin de gérer les actions (modifier/supprimer), vous pouvez :

**Option A : Utiliser des événements personnalisés**

Modifiez le composant DataTable pour accepter un template d'actions :

```typescript
// Dans datatable.component.ts, ajoutez :
@Input() actionTemplate?: TemplateRef<any>;
```

**Option B : Utiliser un render personnalisé avec des callbacks globaux**

Dans votre composant :

```typescript
ngOnInit() {
  // Exposer les méthodes globalement pour les boutons dans le render
  (window as any).editUser = (id: number) => this.onEdit(this.users.find(u => u.id === id)!);
  (window as any).deleteUser = (id: number) => this.onDelete(id);
}
```

## Intégration complète - Exemple User Component

Voici un exemple complet pour le composant User :

```typescript
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { DataTableComponent, DataTableColumn } from '../../../shared/components/datatable/datatable.component';
import { Role } from '../../../models/role';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, ...],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  users: User[] = [];
  columns: DataTableColumn[] = [
    { key: 'nom', label: 'Nom', sortable: true },
    { key: 'prenom', label: 'Prénom', sortable: true },
    { key: 'username', label: 'Username', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'roles[0].name', 
      label: 'Rôle', 
      sortable: false 
    },
    { 
      key: 'active', 
      label: 'Statut', 
      sortable: true,
      render: (value: any) => value ? 'Actif' : 'Inactif'
    }
  ];

  // ... reste du code
}
```

## Fonctionnalités disponibles

- ✅ Recherche en temps réel
- ✅ Tri par colonne (si `sortable: true`)
- ✅ Pagination avec sélection du nombre d'éléments par page
- ✅ Export Excel
- ✅ Export PDF
- ✅ Support du mode sombre
- ✅ Responsive

## Notes importantes

1. Les colonnes avec `sortable: false` ne seront pas triables
2. Utilisez `render` pour formater l'affichage des cellules
3. Pour les valeurs imbriquées, utilisez la notation point : `roles[0].name` ou `user.profile.name`
4. Le `fileName` sera utilisé pour les exports (sans extension)



