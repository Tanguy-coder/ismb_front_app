import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { InputFieldComponent } from "../../shared/components/form/input/input-field.component";
import { LabelComponent } from "../../shared/components/form/label/label.component";
import { PageBreadcrumbComponent } from "../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { Etudiant } from "../../models/etudiant";
import { EtudiantService } from "../../services/etudiant.service";
import { ButtonComponent } from "../../shared/components/ui/button/button.component";
import { CommonModule } from "@angular/common";
import { NotificationService } from "../../services/notification.service";
import { Filiere } from "../../models/filiere";
import { FiliereService } from "../../services/filiere.service";
import { Role } from '../../models/role';

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
  ],
  templateUrl: './etudiant.component.html',
})
export class EtudiantComponent implements OnInit {
  etudiant: Etudiant = new Etudiant();
  etudiants: Etudiant[] = [];
  allEtudiants: Etudiant[] = [];
  filieres: Filiere[] = [];
  editMode: boolean = false;
  searchTerm: string = '';
  selectedPhotoFile: File | null = null;
  readonly emailPattern: string = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';

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
  }

  getEtudiants(): void {
    this.service.index().subscribe({
      next: (response: Etudiant[]) => {
        this.allEtudiants = response;
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

  onSearch(): void {
    if (!this.searchTerm) {
      this.etudiants = this.allEtudiants;
      return;
    }
    this.etudiants = this.allEtudiants.filter(e =>
      (e.nom && e.nom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (e.prenom && e.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
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
  }

  onDelete(id: number | undefined): void {
    if (id === undefined) return;
    if (confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
      this.service.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess("Étudiant supprimé avec succès !");
          this.getEtudiants();
          this.resetForm();
        }
      });
    }
  }

  resetForm(): void {
    this.etudiant = new Etudiant();
    this.etudiant.password = 'etu1234';
    this.etudiant.roles = [{ id: 4, name: 'Student' }]; // Assuming Role has id and name properties
    this.etudiant.isActive = true;
    this.etudiant.statut = 'Nouveau'; // Default to 'Nouveau'
    this.selectedPhotoFile = null;
    this.editMode = false;
    const photoInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (photoInput) photoInput.value = '';
  }

  private isValidEmail(email: string | null | undefined): boolean {
    return !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
