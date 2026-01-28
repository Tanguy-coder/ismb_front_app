import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { InputFieldComponent } from "../../shared/components/form/input/input-field.component";
import { LabelComponent } from "../../shared/components/form/label/label.component";
import { PageBreadcrumbComponent } from "../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { Enseignant } from "../../models/enseignant";
import { EnseignantService } from "../../services/enseignant.service";
import { ButtonComponent } from "../../shared/components/ui/button/button.component";
import { CommonModule } from "@angular/common";
import { NotificationService } from "../../services/notification.service";
import { DataTableComponent, DataTableColumn } from '../../shared/components/datatable/datatable.component';

@Component({
  selector: 'app-enseignant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputFieldComponent,
    LabelComponent,
    PageBreadcrumbComponent,
    ButtonComponent,
    DataTableComponent,
  ],
  templateUrl: './enseignant.component.html',
})
export class EnseignantComponent implements OnInit {
  enseignant: Enseignant = new Enseignant();
  enseignants: Enseignant[] = [];
  editMode: boolean = false;
  showForm: boolean = false;
  selectedPhotoFile: File | null = null;
  photoPreviewUrl: string | null = null;
  private readonly uploadsBaseUrl = 'http://localhost:8080/uploads/';
  readonly emailPattern: string = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';

  columns: DataTableColumn[] = [
    { 
      key: 'photo', 
      label: 'Photo', 
      sortable: false,
      render: (value: any, row: any) => {
        const photoUrl = row.photo ? `http://localhost:8080/uploads/${row.photo}` : 'https://via.placeholder.com/40';
        return `<img src="${photoUrl}" alt="Photo" class="h-10 w-10 rounded-full object-cover">`;
      }
    },
    { 
      key: 'nom', 
      label: 'Nom', 
      sortable: true,
      render: (value: any, row: any) => `${row.nom || ''} ${row.prenom || ''}`
    },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'contact', label: 'Contact', sortable: false },
    { key: 'sexe', label: 'Sexe', sortable: true },
    { 
      key: 'dateNaissance', 
      label: 'Date de Naissance', 
      sortable: true,
      render: (value: any) => {
        if (!value) return '';
        const date = new Date(value);
        return date.toLocaleDateString('fr-FR');
      }
    },
    { key: 'lieuNaissance', label: 'Lieu de Naissance', sortable: false },
    { key: 'nationalite', label: 'Nationalité', sortable: true },
    { 
      key: 'statut', 
      label: 'Statut', 
      sortable: true,
      render: (value: any) => {
        const classes = value === 'Actif' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800';
        return `<span class="px-2 py-1 rounded-full text-xs ${classes}">${value || ''}</span>`;
      }
    },
    { 
      key: 'etat', 
      label: 'État', 
      sortable: true,
      render: (value: any) => {
        const classes = value 
          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        const text = value ? 'En fonction' : 'Affecté';
        return `<span class="px-2 py-1 rounded-full text-xs ${classes}">${text}</span>`;
      }
    },
    { key: 'actions', label: 'Actions', sortable: false, isAction: true }
  ];

  constructor(
    private service: EnseignantService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getEnseignants();
    this.resetForm(); // Set default values
  }

  onPhotoFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.selectedPhotoFile = element.files ? element.files[0] : null;

    if (this.photoPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }
    this.photoPreviewUrl = this.selectedPhotoFile ? URL.createObjectURL(this.selectedPhotoFile) : null;
  }

  getEnseignants(): void {
    this.service.index().subscribe({
      next: (response: Enseignant[]) => {
        this.enseignants = response;
      }
    });
  }

  onSubmit(): void {
    if (!this.enseignant.nom || !this.enseignant.prenom || !this.enseignant.email) {
      this.notificationService.showWarning("Le nom, le prénom et l'email sont obligatoires.");
      return;
    }

    if (!this.isValidEmail(this.enseignant.email)) {
      this.notificationService.showWarning("Veuillez renseigner un email valide.");
      return;
    }

    // Generate username
    if (this.enseignant.nom && this.enseignant.prenom) {
      this.enseignant.username = (this.enseignant.nom.charAt(0) + this.enseignant.prenom).toLowerCase();
    }

    // Ensure default values for password, isActive, and roles are set before submission
    if (!this.enseignant.password) {
      this.enseignant.password = 'ens1234';
    }
    if (this.enseignant.isActive === undefined) {
      this.enseignant.isActive = true;
    }
    if (!this.enseignant.roles || this.enseignant.roles.length === 0) {
      this.enseignant.roles = [{ id: 3, name: 'Teacher' }]; // Assuming Role has id and name properties
    }

    const formData = new FormData();
    formData.append('enseignant', new Blob([JSON.stringify(this.enseignant)], { type: 'application/json' }));
    if (this.selectedPhotoFile) {
      formData.append('photo', this.selectedPhotoFile);
    }

    const operation = this.editMode
      ? this.service.update(this.enseignant.id!, formData)
      : this.service.store(formData);

    const successMessage = this.editMode
      ? "Enseignant mis à jour avec succès !"
      : "Enseignant créé avec succès !";

    operation.subscribe({
      next: () => {
        this.notificationService.showSuccess(successMessage);
        this.getEnseignants();
        this.resetForm();
      }
    });
  }

  showAddForm(): void {
    this.editMode = false;
    this.enseignant = new Enseignant();
    this.enseignant.password = 'ens1234';
    this.enseignant.roles = [{ id: 3, name: 'Teacher' }];
    this.enseignant.isActive = true;
    this.enseignant.statut = 'Actif';
    this.enseignant.etat = true;
    this.selectedPhotoFile = null;
    this.photoPreviewUrl = null;
    const photoInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (photoInput) photoInput.value = '';
    this.showForm = true;
  }

  onEdit(enseignant: Enseignant): void {
    this.editMode = true;
    this.showForm = true;
    this.enseignant = { ...enseignant };

    if (this.photoPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }
    this.selectedPhotoFile = null;
    this.photoPreviewUrl = this.enseignant.photo ? `${this.uploadsBaseUrl}${this.enseignant.photo}` : null;
  }

  onDelete(enseignant: Enseignant): void {
    if (enseignant.id === undefined) return;
    this.service.delete(enseignant.id).subscribe({
        next: () => {
          this.notificationService.showSuccess("Enseignant supprimé avec succès !");
          this.getEnseignants();
          this.resetForm();
        }
      });
  }

  resetForm(): void {
    if (this.photoPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }
    this.enseignant = new Enseignant();
    this.enseignant.password = 'ens1234';
    this.enseignant.roles = [{ id: 3, name: 'Teacher' }]; // Assuming Role has id and name properties
    this.enseignant.isActive = true;
    this.enseignant.statut = 'Actif'; // Default to 'Actif'
    this.enseignant.etat = true; // Default to 'En fonction'
    this.selectedPhotoFile = null;
    this.photoPreviewUrl = null;
    this.editMode = false;
    this.showForm = false;
    const photoInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (photoInput) photoInput.value = '';
  }

  private isValidEmail(email: string | null | undefined): boolean {
    return !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}