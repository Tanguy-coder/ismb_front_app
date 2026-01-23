import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { InputFieldComponent } from "../../shared/components/form/input/input-field.component";
import { LabelComponent } from "../../shared/components/form/label/label.component";
import { PageBreadcrumbComponent } from "../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { Etudiant } from "../../models/etudiant";
import { EtudiantService } from "../../services/etudiant.service";
import { ButtonComponent } from "../../shared/components/ui/button/button.component";
import { CommonModule, DatePipe } from "@angular/common";
import { NotificationService } from "../../services/notification.service";
import { Filiere } from "../../models/filiere";
import { FiliereService } from "../../services/filiere.service";
import { Role } from '../../models/role';
import { DataTableComponent, DataTableColumn } from '../../shared/components/datatable/datatable.component';

@Component({
  selector: 'app-etudiant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputFieldComponent,
    LabelComponent,
    PageBreadcrumbComponent,
    ButtonComponent,
    DataTableComponent,
    DatePipe
  ],
  templateUrl: './etudiant.component.html',
})
export class EtudiantComponent implements OnInit {
  etudiant: Etudiant = new Etudiant();
  etudiants: Etudiant[] = [];
  filieres: Filiere[] = [];
  editMode: boolean = false;
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
    { key: 'filiere.libelle', label: 'Filière', sortable: true },
    { 
      key: 'statut', 
      label: 'Statut', 
      sortable: true,
      render: (value: any) => {
        const classes = value === 'Nouveau' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-yellow-100 text-yellow-800';
        return `<span class="px-2 py-1 rounded-full text-xs ${classes}">${value || ''}</span>`;
      }
    },
    { key: 'actions', label: 'Actions', sortable: false, isAction: true }
  ];

  constructor(
    private service: EtudiantService,
    private filiereService: FiliereService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getEtudiants();
    this.getFilieres();
  }

  onPhotoFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.selectedPhotoFile = element.files ? element.files[0] : null;

    // Prévisualisation
    if (this.photoPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }
    this.photoPreviewUrl = this.selectedPhotoFile ? URL.createObjectURL(this.selectedPhotoFile) : null;
  }

  getEtudiants(): void {
    this.service.index().subscribe({
      next: (response: Etudiant[]) => {
        this.etudiants = response;
      }
    });
  }

  getFilieres(): void {
    this.filiereService.index().subscribe({
      next: (response: Filiere[]) => {
        this.filieres = response;
      }
    });
  }

  onSubmit(): void {
    if (!this.etudiant.nom || !this.etudiant.prenom || !this.etudiant.email) {
      this.notificationService.showWarning("Le nom, le prénom et l'email sont obligatoires.");
      return;
    }

    if (!this.isValidEmail(this.etudiant.email)) {
      this.notificationService.showWarning("Veuillez renseigner un email valide.");
      return;
    }

    // Generate username
    if (this.etudiant.nom && this.etudiant.prenom) {
      this.etudiant.username = (this.etudiant.nom.charAt(0) + this.etudiant.prenom).toLowerCase();
    }

    // Ensure default values for password, isActive, and roles are set before submission
    if (!this.etudiant.password) {
      this.etudiant.password = 'etu1234';
    }
    if (this.etudiant.isActive === undefined) {
      this.etudiant.isActive = true;
    }
    if (!this.etudiant.roles || this.etudiant.roles.length === 0) {
      this.etudiant.roles = [{ id: 4, name: 'Student' }]; // Assuming Role has id and name properties
    }

    const formData = new FormData();
    formData.append('etudiant', new Blob([JSON.stringify(this.etudiant)], { type: 'application/json' }));
    if (this.selectedPhotoFile) {
      formData.append('photo', this.selectedPhotoFile);
    }

    console.log(this.etudiant);
    const operation = this.editMode
      ? this.service.update(this.etudiant.id!, formData)
      : this.service.store(formData);

    const successMessage = this.editMode
      ? "Étudiant mis à jour avec succès !"
      : "Étudiant créé avec succès !"

    operation.subscribe({
      next: () => {
        this.notificationService.showSuccess(successMessage);
        this.getEtudiants();
        this.resetForm();
      }
    });
  }

  onEdit(etudiant: Etudiant): void {
    this.editMode = true;
    this.etudiant = { ...etudiant };

    // Prévisualisation: image actuelle si pas encore remplacée
    if (this.photoPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }
    this.selectedPhotoFile = null;
    this.photoPreviewUrl = this.etudiant.photo ? `${this.uploadsBaseUrl}${this.etudiant.photo}` : null;
  }

  onDelete(etudiant: Etudiant): void {
    if (etudiant.id === undefined) return;
    if (confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
      this.service.delete(etudiant.id).subscribe({
        next: () => {
          this.notificationService.showSuccess("Étudiant supprimé avec succès !");
          this.getEtudiants();
          this.resetForm();
        }
      });
    }
  }

  resetForm(): void {
    if (this.photoPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }
    this.etudiant = new Etudiant();
    this.etudiant.password = 'etu1234';
    this.etudiant.roles = [{ id: 4, name: 'Student' }]; // Assuming Role has id and name properties
    this.etudiant.isActive = true;
    this.etudiant.statut = 'Nouveau'; // Default to 'Nouveau'
    this.selectedPhotoFile = null;
    this.photoPreviewUrl = null;
    this.editMode = false;
    const photoInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (photoInput) photoInput.value = '';
  }

  private isValidEmail(email: string | null | undefined): boolean {
    return !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
