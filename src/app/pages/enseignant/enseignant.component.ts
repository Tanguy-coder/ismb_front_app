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
  ],
  templateUrl: './enseignant.component.html',
})
export class EnseignantComponent implements OnInit {
  enseignant: Enseignant = new Enseignant();
  enseignants: Enseignant[] = [];
  allEnseignants: Enseignant[] = [];
  editMode: boolean = false;
  searchTerm: string = '';
  selectedPhotoFile: File | null = null;

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
  }

  getEnseignants(): void {
    this.service.index().subscribe({
      next: (response: Enseignant[]) => {
        this.allEnseignants = response;
        this.enseignants = response;
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.enseignants = this.allEnseignants;
      return;
    }
    this.enseignants = this.allEnseignants.filter(e =>
      (e.nom && e.nom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (e.prenom && e.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  onSubmit(): void {
    if (!this.enseignant.nom || !this.enseignant.prenom || !this.enseignant.email) {
      this.notificationService.showWarning("Le nom, le prénom et l'email sont obligatoires.");
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

  onEdit(enseignant: Enseignant): void {
    this.editMode = true;
    this.enseignant = { ...enseignant };
  }

  onDelete(id: number | undefined): void {
    if (id === undefined) return;
    if (confirm("Voulez-vous vraiment supprimer cet enseignant ?")) {
      this.service.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess("Enseignant supprimé avec succès !");
          this.getEnseignants();
          this.resetForm();
        }
      });
    }
  }

  resetForm(): void {
    this.enseignant = new Enseignant();
    this.enseignant.password = 'ens1234';
    this.enseignant.roles = [{ id: 3, name: 'Teacher' }]; // Assuming Role has id and name properties
    this.enseignant.isActive = true;
    this.enseignant.statut = 'Actif'; // Default to 'Actif'
    this.selectedPhotoFile = null;
    this.editMode = false;
    const photoInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (photoInput) photoInput.value = '';
  }
}