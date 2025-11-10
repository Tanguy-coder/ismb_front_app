import { Component, OnInit } from '@angular/core';
import { MatiereService } from '../../../services/matiere.service';
import { Matiere } from '../../../models/matiere';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { NotificationService } from "../../../services/notification.service";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { MultiSelectComponent, Option } from "../../../shared/components/form/multi-select/multi-select.component";
import { Niveau } from '../../../models/niveau';
import { NiveauService } from '../../../services/niveau.service';

@Component({
  selector: 'app-matiere',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent, InputFieldComponent, LabelComponent, ButtonComponent, MultiSelectComponent],
  templateUrl: './matiere.component.html',
})
export class MatiereComponent implements OnInit {
  matiere: Matiere = new Matiere();
  matieres: Matiere[] = [];
  allMatieres: Matiere[] = [];
  niveaux: Niveau[] = [];
  multiSelectOptions: Option[] = [];
  selectedNiveauIds: string[] = [];
  public editMode: boolean = false;
  public searchTerm: string = '';

  constructor(
      private service: MatiereService,
      private niveauService: NiveauService,
      private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.getMatieres();
    this.getNiveaux();
  }

  private validateForm(): boolean {
    if (!this.matiere.libelle || !this.matiere.niveaux || this.matiere.niveaux.length === 0) {
      this.notificationService.showWarning("Veuillez renseigner les champs obligatoires.");
      return false;
    }
    return true;
  }

  getMatieres(): void {
    this.service.index().subscribe({
      next: (response: Matiere[]) => {
        this.allMatieres = response;
        this.matieres = response;
        console.log(response);
      }
    });
  }

  getNiveaux(): void {
    this.niveauService.index().subscribe({
      next: (response: Niveau[]) => {
        this.niveaux = response;
        this.multiSelectOptions = this.niveaux.map(n => ({ value: n.id!.toString(), text: n.libelle! }));
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.matieres = this.allMatieres;
      return;
    }
    this.matieres = this.allMatieres.filter(matiere =>
        (matiere.libelle && matiere.libelle.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (matiere.sigle && matiere.sigle.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (matiere.type && matiere.type.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }
    console.log('Les matières : '+this.matiere.libelle, this.matiere.niveaux);
    const operation = this.editMode
        ? this.service.update(this.matiere.id!, this.matiere)
        : this.service.store(this.matiere);

    const successMessage = this.editMode
        ? "Matière mise à jour avec succès !"
        : "Matière créée avec succès !";

    operation.subscribe({
      next: () => {
        this.notificationService.showSuccess(successMessage);
        this.getMatieres();
        this.resetForm();
      }
    });
  }

  onEdit(matiere: Matiere): void {
    this.editMode = true;
    this.matiere = { ...matiere };
    this.selectedNiveauIds = this.matiere.niveaux ? this.matiere.niveaux.map(n => n.id!.toString()) : [];
  }

  onDelete(id: number | undefined): void {
    if (id === undefined) return;
    if (confirm("Voulez-vous vraiment supprimer cette matière ?")) {
      this.service.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess("Matière supprimée avec succès !");
          this.getMatieres();
          this.resetForm();
        }
      });
    }
  }

  resetForm(): void {
    this.matiere = new Matiere();
    this.matiere.niveaux = []; // Initialize niveaux as an empty array
    this.selectedNiveauIds = [];
    this.editMode = false;
  }

  onNiveauxSelectionChange(selectedIds: string[]): void {
    this.matiere.niveaux = selectedIds.map(id => this.niveaux.find(n => n.id?.toString() === id)).filter(Boolean) as Niveau[];
  }

  getNiveauLibelles(matiere: Matiere): string {
    return matiere.niveaux ? matiere.niveaux.map(n => n.libelle).join(', ') : '';
  }
}
