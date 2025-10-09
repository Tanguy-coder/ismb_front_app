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
  ],
  templateUrl: './etablissement.component.html',
})
export class EtablissementComponent implements OnInit {
  etablissement: Etablissement = new Etablissement();
  etablissements: Etablissement[] = [];
  allEtablissements: Etablissement[] = [];
  editMode: boolean = false;
  searchTerm: string = '';
  selectedLogoFile: File | null = null;
  selectedImageFile: File | null = null;

  constructor(
    private service: EtablissementService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getEtablissements();
    console.log(this.etablissement);
  }

  onLogoFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.selectedLogoFile = element.files ? element.files[0] : null;
  }

  onImageFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.selectedImageFile = element.files ? element.files[0] : null;
  }

  getEtablissements(): void {
    this.service.index().subscribe({
      next: (response: Etablissement[]) => {
        console.log('Données brutes reçues de l\'API:', response);
        this.allEtablissements = response;
        this.etablissements = response;
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.etablissements = this.allEtablissements;
      return;
    }
    this.etablissements = this.allEtablissements.filter(e =>
      e.nom && e.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSubmit(): void {
    if (!this.etablissement.nom || !this.etablissement.email) {
      this.notificationService.showWarning("Le nom et l'email sont obligatoires.");
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.etablissement.nom);
    formData.append('email', this.etablissement.email);
    if (this.etablissement.contact) formData.append('contact', this.etablissement.contact);
    if (this.etablissement.numero) formData.append('numero', this.etablissement.numero);
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
      }
    });
  }

  onEdit(etablissement: Etablissement): void {
    this.editMode = true;
    this.etablissement = { ...etablissement };
  }

  onDelete(id: number | undefined): void {
    if (id === undefined) return;
    if (confirm("Voulez-vous vraiment supprimer cet établissement ?")) {
      this.service.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess("Établissement supprimé avec succès !");
          this.getEtablissements();
          this.resetForm();
        }
      });
    }
  }

  resetForm(): void {
    this.etablissement = new Etablissement();
    this.selectedLogoFile = null;
    this.selectedImageFile = null;
    this.editMode = false;
    const logoInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (logoInput) logoInput.value = '';
    const imageInput = document.getElementById('image-upload') as HTMLInputElement;
    if (imageInput) imageInput.value = '';
  }
}