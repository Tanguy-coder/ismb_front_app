import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FiliereService } from '../../../services/filiere.service';
import { Filiere } from '../../../models/filiere';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { NotificationService } from "../../../services/notification.service";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { Niveau } from '../../../models/niveau';
import { NiveauService } from '../../../services/niveau.service';
import { AnneeScolaire } from '../../../models/annee-scolaire';
import { AnneeService } from '../../../services/annee.service';

@Component({
  selector: 'app-filiere',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent, InputFieldComponent, LabelComponent, ButtonComponent],
  templateUrl: './filiere.component.html',
  styleUrl: './filiere.component.css'
})
export class FiliereComponent implements OnInit {
  filiere: Filiere = new Filiere();
  filieres: Filiere[] = [];
  allFilieres: Filiere[] = [];
  niveaux: Niveau[] = [];
  anneesScolaires: AnneeScolaire[] = [];
  selectedAnneeScolaire: AnneeScolaire | undefined = undefined;
  public editMode: boolean = false;

  constructor(
      private service: FiliereService,
      private niveauService: NiveauService,
      private anneeService: AnneeService,
      private notificationService: NotificationService,
      private router: Router
  ) {}

  ngOnInit() {
    this.getFilieres();
    this.getNiveaux();
    this.getAnneesScolaires();
  }

  private validateForm(): boolean {
    if (!this.filiere.libelle || !this.filiere.niveau) {
      this.notificationService.showWarning("Veuillez renseigner les champs obligatoires.");
      return false;
    }
    return true;
  }

  getFilieres(): void {
    this.service.index().subscribe({
      next: (response: Filiere[]) => {
        this.allFilieres = response;
        this.filieres = response;
      }
    });
  }

  getNiveaux(): void {
    this.niveauService.index().subscribe({
      next: (response: Niveau[]) => {
        this.niveaux = response;
      }
    });
  }

  getAnneesScolaires(): void {
    this.anneeService.index().subscribe({
      next: (response: AnneeScolaire[]) => {
        this.anneesScolaires = response;
      }
    });
  }

  onAnneeScolaireChange(): void {
    this.applyAnneeFilter();
  }

  private applyAnneeFilter(): void {
    if (!this.selectedAnneeScolaire) {
      this.filieres = this.allFilieres;
    } else {
      
    }
  }


  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }
    //console.log(this.filiere);
    const operation = this.editMode
        ? this.service.update(this.filiere.id!, this.filiere)
        : this.service.store(this.filiere);

    const successMessage = this.editMode
        ? "Filière mise à jour avec succès !"
        : "Filière créée avec succès !";

    operation.subscribe({
      next: () => {
        this.notificationService.showSuccess(successMessage);
        this.getFilieres();
        this.resetForm();
      }
    });
  }

  onEdit(filiere: Filiere): void {
    this.editMode = true;
    this.filiere = { ...filiere };
  }

  onDelete(filiere: Filiere): void {
    if (filiere.id === undefined) return;
    if (confirm("Voulez-vous vraiment supprimer cette filière ?")) {
      this.service.delete(filiere.id).subscribe({
        next: () => {
          this.notificationService.showSuccess("Filière supprimée avec succès !");
          this.getFilieres();
          this.resetForm();
        }
      });
    }
  }

  resetForm(): void {
    this.filiere = new Filiere();
    this.editMode = false;
  }

  onListeClasseClick(filiereId: number): void {
      if (!this.selectedAnneeScolaire){
          this.notificationService.showWarning("Veuillez sélectionner l'année académique pour afficher la liste des classes");
          return;
      }
      
      const filiere = this.filieres.find(f => f.id === filiereId);
      const filiereLibelle = filiere?.libelle || 'Filière';
      
      this.router.navigate(['/liste-classe'], {
          queryParams: {
              filiereId: filiereId,
              anneeScolaireId: this.selectedAnneeScolaire.id,
              filiereLibelle: filiereLibelle,
              anneeCode: this.selectedAnneeScolaire.code
          }
      });
  }
}
