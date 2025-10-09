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

@Component({
  selector: 'app-annee-scolaire',
  standalone: true,
  imports: [
    FormsModule,
    InputFieldComponent,
    LabelComponent,
    PageBreadcrumbComponent,
    ButtonComponent,
    CommonModule
  ],
  templateUrl: './annee-scolaire.component.html',
  styles: ``
})
export class AnneeScolaireComponent implements OnInit {
    annee: AnneeScolaire = new AnneeScolaire();
    annees: AnneeScolaire[] = [];
    allAnnees: AnneeScolaire[] = []; // To hold the original list
    public editMode: boolean = false;
    public searchTerm: string = '';

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
                this.allAnnees = response;
                this.annees = response;
            }
            // Les erreurs sont gérées globalement par HandleErrorsService
        });
    }

    onSearch(): void {
        if (!this.searchTerm) {
            this.annees = this.allAnnees;
            return;
        }
        this.annees = this.allAnnees.filter(annee =>
            annee.code && annee.code.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
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

    onEdit(annee: AnneeScolaire): void {
        this.editMode = true;
        this.annee = { ...annee }; // Use spread operator for a clean copy
    }

    onDelete(id: number | undefined): void {
        if (id === undefined) return;
        if (confirm("Voulez-vous vraiment supprimer cette année scolaire ?")) {
            this.service.delete(id).subscribe({
                next: () => {
                    this.notificationService.showSuccess("Année scolaire supprimée avec succès !");
                    this.getAnnees();
                    this.resetForm(); // Also reset form in case the deleted item was being edited
                }
            });
        }
    }

    resetForm(): void {
        this.annee = new AnneeScolaire();
        this.editMode = false;
    }
}
