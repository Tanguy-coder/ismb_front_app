import { Component, OnInit } from '@angular/core';
import { NiveauService } from '../../../services/niveau.service';
import { Niveau } from '../../../models/niveau';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { NotificationService } from "../../../services/notification.service";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { DataTableComponent, DataTableColumn } from '../../../shared/components/datatable/datatable.component';

@Component({
  selector: 'app-niveau',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent, InputFieldComponent, LabelComponent, ButtonComponent, DataTableComponent],
  templateUrl: './niveau.component.html',
  styleUrl: './niveau.component.css'
})
export class NiveauComponent implements OnInit {
  niveau: Niveau = new Niveau();
  niveaux: Niveau[] = [];
  public editMode: boolean = false;

  columns: DataTableColumn[] = [
    { key: 'libelle', label: 'Libellé', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false, isAction: true }
  ];

  constructor(
      private service: NiveauService,
      private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.getNiveaux();
  }

  private validateForm(): boolean {
    if (!this.niveau.libelle) {
      this.notificationService.showWarning("Veuillez renseigner le libellé.");
      return false;
    }
    return true;
  }

  getNiveaux(): void {
    this.service.index().subscribe({
      next: (response: Niveau[]) => {
        this.niveaux = response;
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    const operation = this.editMode
        ? this.service.update(this.niveau.id!, this.niveau)
        : this.service.store(this.niveau);

    const successMessage = this.editMode
        ? "Niveau mis à jour avec succès !"
        : "Niveau créé avec succès !";

    operation.subscribe({
      next: () => {
        this.notificationService.showSuccess(successMessage);
        this.getNiveaux();
        this.resetForm();
      }
    });
  }

  onEdit(niveau: Niveau): void {
    this.editMode = true;
    this.niveau = { ...niveau };
  }

  onDelete(niveau: Niveau): void {
    if (niveau.id === undefined) return;
    if (confirm("Voulez-vous vraiment supprimer ce niveau ?")) {
      this.service.delete(niveau.id).subscribe({
        next: () => {
          this.notificationService.showSuccess("Niveau supprimé avec succès !");
          this.getNiveaux();
          this.resetForm();
        }
      });
    }
  }

  resetForm(): void {
    this.niveau = new Niveau();
    this.editMode = false;
  }
}
