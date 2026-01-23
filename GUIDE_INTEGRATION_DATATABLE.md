# Guide d'intégration DataTable avec Export Excel/PDF

## 📦 Composants créés

1. **ExportService** (`src/app/services/export.service.ts`)
   - Export Excel avec XLSX
   - Export PDF avec jsPDF et autoTable

2. **DataTableComponent** (`src/app/shared/components/datatable/datatable.component.ts`)
   - Tableau réutilisable avec recherche, tri, pagination
   - Boutons d'export Excel et PDF
   - Support du mode sombre

## 🚀 Intégration rapide - Exemple User Component

### Étape 1 : Modifier user.component.ts

```typescript
import { DataTableComponent, DataTableColumn } from '../../../shared/components/datatable/datatable.component';

export class UserComponent implements OnInit {
  // ... vos propriétés existantes
  
  // Ajouter la configuration des colonnes
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

  // Modifier onDelete pour accepter un User au lieu d'un id
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
}
```

### Étape 2 : Ajouter DataTableComponent aux imports

```typescript
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
    DataTableComponent  // Ajouter cette ligne
  ],
  // ...
})
```

### Étape 3 : Remplacer le tableau dans user.component.html

**Remplacez toute la section "Table Section" (lignes 58-110) par :**

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
</app-datatable>
```

### Étape 4 : Supprimer la méthode onSearch (optionnel)

Si vous utilisez DataTable, vous n'avez plus besoin de la méthode `onSearch()` car la recherche est gérée par le composant.

## 📋 Intégration pour les autres composants

### Filière Component

```typescript
columns: DataTableColumn[] = [
  { key: 'libelle', label: 'Libellé', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
  { key: 'niveau.libelle', label: 'Niveau', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false, isAction: true }
];
```

### Étudiant Component

```typescript
columns: DataTableColumn[] = [
  { key: 'nom', label: 'Nom', sortable: true },
  { key: 'prenom', label: 'Prénom', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'filiere.libelle', label: 'Filière', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false, isAction: true }
];
```

### UE Component

```typescript
columns: DataTableColumn[] = [
  { key: 'code', label: 'Code', sortable: true },
  { key: 'libelle', label: 'Libellé', sortable: true },
  { key: 'credits', label: 'Crédits', sortable: true },
  { key: 'filiere.libelle', label: 'Filière', sortable: true },
  { key: 'matiere.libelle', label: 'Matière', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false, isAction: true }
];
```

## ✨ Fonctionnalités disponibles

- ✅ **Recherche** : Recherche en temps réel dans toutes les colonnes
- ✅ **Tri** : Tri par colonne (si `sortable: true`)
- ✅ **Pagination** : Pagination avec sélection du nombre d'éléments (10, 25, 50, 100)
- ✅ **Export Excel** : Export au format .xlsx
- ✅ **Export PDF** : Export au format .pdf avec mise en forme
- ✅ **Actions** : Boutons Modifier/Supprimer intégrés
- ✅ **Mode sombre** : Support automatique du mode sombre
- ✅ **Responsive** : Tableau responsive pour mobile

## 🎨 Personnalisation

### Rendu personnalisé des cellules

```typescript
{
  key: 'status',
  label: 'Statut',
  render: (value: any) => {
    return value === 'active' 
      ? '<span class="text-green-500">✓ Actif</span>'
      : '<span class="text-red-500">✗ Inactif</span>';
  }
}
```

### Valeurs imbriquées

Pour accéder à des propriétés imbriquées, utilisez la notation point :

```typescript
{ key: 'user.profile.name', label: 'Nom du profil' }
{ key: 'roles[0].name', label: 'Premier rôle' }
```

## 📝 Notes importantes

1. Les colonnes avec `isAction: true` affichent automatiquement les boutons Modifier/Supprimer
2. Les événements `onEdit` et `onDelete` sont émis avec l'objet complet de la ligne
3. Le `fileName` sera utilisé pour les exports (sans extension)
4. La recherche fonctionne sur toutes les colonnes visibles
5. Le tri est désactivé pour les colonnes avec `sortable: false`

## 🔧 Dépannage

### Les exports ne fonctionnent pas
- Vérifiez que les dépendances sont installées : `npm install xlsx jspdf jspdf-autotable`
- Vérifiez la console du navigateur pour les erreurs

### Les actions ne fonctionnent pas
- Assurez-vous que la colonne actions a `isAction: true`
- Vérifiez que les événements `onEdit` et `onDelete` sont bien connectés

### Le tri ne fonctionne pas
- Vérifiez que `sortable: true` est défini sur la colonne
- Les valeurs null/undefined sont placées à la fin



