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
import { DataTableComponent, DataTableColumn } from '../../../shared/components/datatable/datatable.component';

@Component({
  selector: 'app-matiere',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent, InputFieldComponent, LabelComponent, ButtonComponent, MultiSelectComponent, DataTableComponent],
  templateUrl: './matiere.component.html',
})
export class MatiereComponent implements OnInit {
  matiere: Matiere = new Matiere();
  matieres: Matiere[] = [];
  niveaux: Niveau[] = [];
  multiSelectOptions: Option[] = [];
  selectedNiveauIds: string[] = [];
  public editMode: boolean = false;

  columns: DataTableColumn[] = [
    { key: 'libelle', label: 'Libellé', sortable: true },
    { key: 'sigle', label: 'Sigle', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { 
      key: 'niveaux', 
      label: 'Niveaux', 
      sortable: false,
      render: (value: any, row: any) => {
        return row.niveaux ? row.niveaux.map((n: any) => n.libelle).join(', ') : '';
      }
    },
    { key: 'actions', label: 'Actions', sortable: false, isAction: true }
  ];

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
        this.matieres = response;
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

  onDelete(matiere: Matiere): void {
    if (matiere.id === undefined) return;
    this.service.delete(matiere.id).subscribe({
      next: () => {
        this.notificationService.showSuccess("Matière supprimée avec succès !");
        this.getMatieres();
        this.resetForm();
      }
    });
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
