import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { Etablissement } from "../../../models/etablissement";
import { EtablissementService } from "../../../services/etablissement.service";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { CommonModule } from "@angular/common";
import { NotificationService } from "../../../services/notification.service";
import { DataTableComponent, DataTableColumn } from '../../../shared/components/datatable/datatable.component';

@Component({
  selector: 'app-etablissement',
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
  templateUrl: './etablissement.component.html',
})
export class EtablissementComponent implements OnInit {
  etablissement: Etablissement = new Etablissement();
  etablissements: Etablissement[] = [];
  editMode: boolean = false;
  etablissementExists: boolean = false;
  showForm: boolean = true;
  selectedLogoFile: File | null = null;
  selectedImageFile: File | null = null;
  logoPreviewUrl: string | null = null;
  imagePreviewUrl: string | null = null;
  private readonly uploadsBaseUrl = 'http://localhost:8080/uploads/';
  readonly emailPattern: string = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';

  columns: DataTableColumn[] = [
    { 
      key: 'logo', 
      label: 'Logo', 
      sortable: false,
      render: (value: any, row: any) => {
        const logoUrl = row.logo ? `http://localhost:8080/uploads/${row.logo}` : 'https://via.placeholder.com/40';
        return `<img src="${logoUrl}" alt="Logo" class="h-10 w-10 rounded-full object-cover">`;
      }
    },
    { key: 'nom', label: 'Nom', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'contact', label: 'Contact', sortable: false },
    { key: 'numero', label: 'Numéro', sortable: false },
    { key: 'devise', label: 'Devise', sortable: false },
    { key: 'ministere', label: 'Ministère', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false, isAction: true }
  ];

  constructor(
    private service: EtablissementService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getEtablissements();
  }

  onLogoFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.selectedLogoFile = element.files ? element.files[0] : null;

    if (this.logoPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.logoPreviewUrl);
    }
    this.logoPreviewUrl = this.selectedLogoFile ? URL.createObjectURL(this.selectedLogoFile) : null;
  }

  onImageFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.selectedImageFile = element.files ? element.files[0] : null;

    if (this.imagePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }
    this.imagePreviewUrl = this.selectedImageFile ? URL.createObjectURL(this.selectedImageFile) : null;
  }

  getEtablissements(): void {
    this.service.index().subscribe({
      next: (response: Etablissement[]) => {
        this.etablissements = response;
        this.etablissementExists = response.length > 0;
        
        // Si un établissement existe, cacher le formulaire par défaut
        if (this.etablissementExists) {
          this.showForm = false;
        }
      }
    });
  }

  onSubmit(): void {
    // Vérifier qu'un seul établissement peut être créé
    if (!this.editMode && this.etablissementExists) {
      this.notificationService.showError("Un établissement existe déjà. Vous pouvez uniquement le modifier.");
      return;
    }

    if (!this.etablissement.nom || !this.etablissement.email) {
      this.notificationService.showWarning("Le nom et l'email sont obligatoires.");
      return;
    }

    if (!this.isValidEmail(this.etablissement.email)) {
      this.notificationService.showWarning("Veuillez renseigner un email valide.");
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.etablissement.nom);
    formData.append('email', this.etablissement.email);
    if (this.etablissement.contact) formData.append('contact', this.etablissement.contact);
    if (this.etablissement.numero) formData.append('numero', this.etablissement.numero);
    if (this.etablissement.devise) formData.append('devise', this.etablissement.devise);
    if (this.etablissement.ministere) formData.append('ministere', this.etablissement.ministere);
    if (this.selectedLogoFile) {
      formData.append('logo', this.selectedLogoFile);
    }
    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    const operation = this.editMode
      ? this.service.update(this.etablissement.id!, formData)
      : this.service.store(formData);

    const successMessage = this.editMode
      ? "Établissement mis à jour avec succès !"
      : "Établissement créé avec succès !";

    operation.subscribe({
      next: () => {
        this.notificationService.showSuccess(successMessage);
        this.getEtablissements();
        this.resetForm();
        
        // Cacher le formulaire après la mise à jour
        if (this.editMode) {
          this.showForm = false;
        }
      }
    });
  }

  onEdit(etablissement: Etablissement): void {
    this.editMode = true;
    this.showForm = true;
    this.etablissement = { ...etablissement };

    // Prévisualisation: fichiers actuels
    if (this.logoPreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(this.logoPreviewUrl);
    if (this.imagePreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(this.imagePreviewUrl);
    this.selectedLogoFile = null;
    this.selectedImageFile = null;
    this.logoPreviewUrl = this.etablissement.logo ? `${this.uploadsBaseUrl}${this.etablissement.logo}` : null;
    this.imagePreviewUrl = this.etablissement.image ? `${this.uploadsBaseUrl}${this.etablissement.image}` : null;
    
    // Scroll vers le formulaire
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(etablissement: Etablissement): void {
    if (etablissement.id === undefined) return;
    
    if (!confirm("⚠️ Attention ! Êtes-vous sûr de vouloir supprimer l'établissement ? Cette action est irréversible.")) {
      return;
    }
    
    this.service.delete(etablissement.id).subscribe({
        next: () => {
          this.notificationService.showSuccess("Établissement supprimé avec succès !");
          this.etablissementExists = false;
          this.getEtablissements();
          this.resetForm();
        }
      });
  }

  resetForm(): void {
    if (this.logoPreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(this.logoPreviewUrl);
    if (this.imagePreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(this.imagePreviewUrl);
    this.etablissement = new Etablissement();
    this.selectedLogoFile = null;
    this.selectedImageFile = null;
    this.logoPreviewUrl = null;
    this.imagePreviewUrl = null;
    this.editMode = false;
    const logoInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (logoInput) logoInput.value = '';
    const imageInput = document.getElementById('image-upload') as HTMLInputElement;
    if (imageInput) imageInput.value = '';
    
    // Cacher le formulaire si un établissement existe
    if (this.etablissementExists) {
      this.showForm = false;
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (this.showForm && this.etablissementExists && this.etablissements.length > 0) {
      // Charger l'établissement existant pour modification
      this.onEdit(this.etablissements[0]);
    }
  }

  private isValidEmail(email: string | null | undefined): boolean {
    return !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}