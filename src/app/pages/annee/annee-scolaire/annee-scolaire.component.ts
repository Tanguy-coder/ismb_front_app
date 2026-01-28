import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { AnneeScolaire } from "../../../models/annee-scolaire";
import { AnneeService } from "../../../services/annee.service";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { CommonModule } from "@angular/common";
import { NotificationService } from "../../../services/notification.service";
import { DataTableComponent, DataTableColumn } from '../../../shared/components/datatable/datatable.component';

@Component({
  selector: 'app-annee-scolaire',
  standalone: true,
  imports: [
    FormsModule,
    InputFieldComponent,
    LabelComponent,
    PageBreadcrumbComponent,
    ButtonComponent,
    CommonModule,
    DataTableComponent
  ],
  templateUrl: './annee-scolaire.component.html',
  styles: ``
})
export class AnneeScolaireComponent implements OnInit {
    annee: AnneeScolaire = new AnneeScolaire();
    annees: AnneeScolaire[] = [];
    public editMode: boolean = false;
    public showForm: boolean = false;

    columns: DataTableColumn[] = [
      { key: 'code', label: 'Code', sortable: true },
      { 
        key: 'dateDebut', 
        label: 'Date Début', 
        sortable: true,
        render: (value: any) => {
          if (!value) return '';
          const date = new Date(value);
          return date.toLocaleDateString('fr-FR');
        }
      },
      { 
        key: 'dateFin', 
        label: 'Date Fin', 
        sortable: true,
        render: (value: any) => {
          if (!value) return '';
          const date = new Date(value);
          return date.toLocaleDateString('fr-FR');
        }
      },
      { key: 'actions', label: 'Actions', sortable: false, isAction: true }
    ];

    constructor(
        private service: AnneeService,
        private notificationService: NotificationService,
    ) {}

    ngOnInit() {
        this.getAnnees();
    }

    private validateForm(): boolean {
        if (!this.annee.code || !this.annee.dateDebut || !this.annee.dateFin) {
            this.notificationService.showWarning("Veuillez renseigner les champs obligatoires.");
            return false;
        }
        return true;
    }

    getAnnees(): void {
        this.service.index().subscribe({
            next: (response: AnneeScolaire[]) => {
                this.annees = response;
            }
            // Les erreurs sont gérées globalement par HandleErrorsService
        });
    }

    onSubmit(): void {
        if (!this.validateForm()) {
            return;
        }

        const operation = this.editMode
            ? this.service.update(this.annee.id!, this.annee)
            : this.service.store(this.annee);

        const successMessage = this.editMode
            ? "Année scolaire mise à jour avec succès !"
            : "Année scolaire créée avec succès !";

        operation.subscribe({
            next: () => {
                this.notificationService.showSuccess(successMessage);
                this.getAnnees();
                this.resetForm();
            }
        });
    }

  showAddForm(): void {
    this.editMode = false;
    this.annee = new AnneeScolaire();
    this.showForm = true;
  }

    onEdit(annee: AnneeScolaire): void {
        this.editMode = true;
        this.showForm = true;
        this.annee = { ...annee }; // Use spread operator for a clean copy
    }

    onDelete(annee: AnneeScolaire): void {
        if (annee.id === undefined) return;
        this.service.delete(annee.id).subscribe({
                next: () => {
                    this.notificationService.showSuccess("Année scolaire supprimée avec succès !");
                    this.getAnnees();
                    this.resetForm(); // Also reset form in case the deleted item was being edited
                }
            });
    }

    resetForm(): void {
        this.annee = new AnneeScolaire();
        this.editMode = false;
        this.showForm = false;
    }
}
