import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { InputFieldComponent } from "../../shared/components/form/input/input-field.component";
import { LabelComponent } from "../../shared/components/form/label/label.component";
import { PageBreadcrumbComponent } from "../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { Ue } from "../../models/ue";
import { UeService } from "../../services/ue.service";
import { ButtonComponent } from "../../shared/components/ui/button/button.component";
import { CommonModule } from "@angular/common";
import { NotificationService } from "../../services/notification.service";
import { Filiere } from "../../models/filiere";
import { Matiere } from "../../models/matiere";
import { Enseignant } from "../../models/enseignant";
import { AnneeScolaire } from "../../models/annee-scolaire";
import { FiliereService } from "../../services/filiere.service";
import { MatiereService } from "../../services/matiere.service";
import { EnseignantService } from "../../services/enseignant.service";
import {AnneeService} from "../../services/annee.service";
import { DataTableComponent, DataTableColumn } from '../../shared/components/datatable/datatable.component';

@Component({
  selector: 'app-ue',
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
  templateUrl: './ue.component.html',
})
export class UeComponent implements OnInit {
  ue: Ue = new Ue();
  ues: Ue[] = [];
  filieres: Filiere[] = [];
  matieres: Matiere[] = [];
  enseignants: Enseignant[] = [];
  anneesScolaires: AnneeScolaire[] = [];
  editMode: boolean = false;

  columns: DataTableColumn[] = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'libelle', label: 'Libellé', sortable: true },
    { key: 'credits', label: 'Crédits', sortable: true },
    { key: 'volumeHoraire', label: 'Volume Horaire', sortable: true },
    { key: 'filiere.libelle', label: 'Filière', sortable: true },
    { key: 'matiere.libelle', label: 'Matière', sortable: true },
    { 
      key: 'enseignant', 
      label: 'Enseignant', 
      sortable: true,
      render: (value: any, row: any) => `${row.enseignant?.nom || ''} ${row.enseignant?.prenom || ''}`
    },
    { key: 'anneeScolaire.code', label: 'Année Scolaire', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false, isAction: true }
  ];

  constructor(
    private service: UeService,
    private filiereService: FiliereService,
    private matiereService: MatiereService,
    private enseignantService: EnseignantService,
    private anneeScolaireService: AnneeService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getUes();
    this.getDropdownData();
    this.resetForm();
  }

  getDropdownData(): void {
    this.filiereService.index().subscribe(data => this.filieres = data);
    this.matiereService.index().subscribe(data => this.matieres = data);
    this.enseignantService.index().subscribe(data => this.enseignants = data);
    this.anneeScolaireService.index().subscribe(data => this.anneesScolaires = data);
  }

  getUes(): void {
    this.service.index().subscribe({
      next: (response: Ue[]) => {
        this.ues = response;
      }
    });
  }

  onSubmit(): void {
    if (!this.ue.libelle || !this.ue.filiere || !this.ue.matiere || !this.ue.enseignant || !this.ue.anneeScolaire) {
      this.notificationService.showWarning("Tous les champs sont obligatoires.");
      return;
    }
    console.log(this.ue)
    const operation = this.editMode
      ? this.service.update(this.ue.id!, this.ue)
      : this.service.store(this.ue);

    const successMessage = this.editMode
      ? "UE mise à jour avec succès !"
      : "UE créée avec succès !";

    operation.subscribe({
      next: () => {
        this.notificationService.showSuccess(successMessage);
        this.getUes();
        this.resetForm();
      }
    });
  }

  onEdit(ue: Ue): void {
    this.editMode = true;
    this.ue = { ...ue };
  }

  onDelete(ue: Ue): void {
    if (ue.id === undefined) return;
    this.service.delete(ue.id).subscribe({
      next: () => {
        this.notificationService.showSuccess("UE supprimée avec succès !");
        this.getUes();
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    this.ue = new Ue();
    this.editMode = false;
  }

  compareById(item1: any, item2: any): boolean {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }
}
