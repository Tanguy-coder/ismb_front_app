import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { ParcourtService } from '../../services/parcourt.service';
import { ListeClasse } from '../../models/liste-classe';
import { NotificationService } from '../../services/notification.service';
import { ExportService } from '../../services/export.service';
import { EtablissementService } from '../../services/etablissement.service';
import { Etablissement } from '../../models/etablissement';

@Component({
  selector: 'app-liste-classe',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './liste-classe.component.html',
  styleUrl: './liste-classe.component.css'
})
export class ListeClasseComponent implements OnInit {
  etudiants: ListeClasse[] = [];
  filiereId!: number;
  anneeScolaireId!: number;
  loading: boolean = false;
  filiereLibelle: string = '';
  anneeCode: string = '';

  // Informations établissement
  etablissement : Etablissement[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private parcourtService: ParcourtService,
    private notificationService: NotificationService,
    private exportService: ExportService,
    private etablissementService: EtablissementService
  ) {}

  ngOnInit(): void {
    this.loadEtablissement();
    
    this.route.queryParams.subscribe(params => {
      this.filiereId = +params['filiereId'];
      this.anneeScolaireId = +params['anneeScolaireId'];
      this.filiereLibelle = params['filiereLibelle'] || 'Filière';
      this.anneeCode = params['anneeCode'] || '';
      
      if (this.filiereId && this.anneeScolaireId) {
        this.loadListeClasse();
      } else {
        this.notificationService.showError('Paramètres invalides');
        this.router.navigate(['/filiere']);
      }
    });
  }

  loadEtablissement(): void {
    this.etablissementService.index().subscribe({
      next: (response) => (this.etablissement = response),
        error:(error) => console.error('Etablissement non trouve')
    });
  }

  loadListeClasse(): void {
    this.loading = true;
    this.parcourtService.getListeClasse(this.filiereId, this.anneeScolaireId).subscribe({
      next: (data) => {
        this.etudiants = data;
        this.loading = false;
        if (data.length === 0) {
          this.notificationService.showInfo('Aucun étudiant trouvé pour cette classe');
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la liste de classe:', error);
        this.notificationService.showError('Erreur lors du chargement de la liste');
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/filiere']);
  }

  getEtablissementLogoUrl(): string {
    if (!this.etablissement[0]?.logo) {
      return '';
    }
    return `http://localhost:8080/uploads/${this.etablissement[0].logo}`;
  }

  getPhotoUrl(photo: string | undefined): string {
    if (!photo) {
      return '/images/user/default-avatar.jpg';
    }
    return `http://localhost:8080/uploads/${photo}`;
  }

  /**
   * Retourne les statistiques au format: G = 87 (N 70, D 17) | F = 94 (N 74, D 20) | T = 181 (N 144, D 37)
   */
  getStatistiquesText(): string {
    const garcons = this.etudiants.filter(e => e.sexe === 'M');
    const filles = this.etudiants.filter(e => e.sexe === 'F');
    const total = this.etudiants.length;

    const garconsNormaux = garcons.filter(e => e.statut === 'N' || !e.statut).length;
    const garconsDoublants = garcons.filter(e => e.statut === 'D').length;
    
    const fillesNormales = filles.filter(e => e.statut === 'N' || !e.statut).length;
    const fillesDoublantes = filles.filter(e => e.statut === 'D').length;
    
    const totalNormaux = garconsNormaux + fillesNormales;
    const totalDoublants = garconsDoublants + fillesDoublantes;

    return `G = ${garcons.length} (N ${garconsNormaux}, D ${garconsDoublants}) | F = ${filles.length} (N ${fillesNormales}, D ${fillesDoublantes}) | T = ${total} (N ${totalNormaux}, D ${totalDoublants})`;
  }

  getStatistiques() {
    const garcons = this.etudiants.filter(e => e.sexe === 'M');
    const filles = this.etudiants.filter(e => e.sexe === 'F');
    
    const garconsNormaux = garcons.filter(e => e.statut === 'N' || !e.statut).length;
    const garconsDoublants = garcons.filter(e => e.statut === 'D').length;
    
    const fillesNormales = filles.filter(e => e.statut === 'N' || !e.statut).length;
    const fillesDoublantes = filles.filter(e => e.statut === 'D').length;

    return {
      garcons: {
        total: garcons.length,
        normaux: garconsNormaux,
        doublants: garconsDoublants
      },
      filles: {
        total: filles.length,
        normales: fillesNormales,
        doublantes: fillesDoublantes
      },
      total: {
        total: this.etudiants.length,
        normaux: garconsNormaux + fillesNormales,
        doublants: garconsDoublants + fillesDoublantes
      }
    };
  }

  exportToPDF(): void {
    const columns = [
      { key: 'numero', label: 'N°' },
      { key: 'nomComplet', label: 'Nom & Prénoms' },
      { key: 'sexe', label: 'Sexe' },
      { key: 'age', label: 'Age' },
      { key: 'statut', label: 'Statuts' },
      { key: 'lieuNaissance', label: 'Lieu de Naissance' },
      // { key: 'nationalite', label: 'Nationalité' }
    ];

    const dataToExport = this.etudiants.map((e, index) => ({
      numero: (index + 1).toString(),
      nomComplet: `${(e.nom || '').toUpperCase()} ${e.prenom || ''}`,
      sexe: e.sexe || '',
      age: e.age ? `${e.age} ans` : '',
      statut: e.statut || 'N',
      lieuNaissance: e.lieuNaissance || '',
      // nationalite: e.nationalite || ''
    }));
    
    this.exportService.exportToPDF(
      dataToExport,
      `Liste_Classe_${this.filiereLibelle}_${new Date().toLocaleDateString()}`,
      `Liste de Classe - ${this.filiereLibelle}\n${this.getStatistiquesText()}`,
      columns
    );
  }

  exportToExcel(): void {
    const dataToExport = this.etudiants.map((e, index) => ({
      'N°': index + 1,
      'Nom': (e.nom || '').toUpperCase(),
      'Prénom': e.prenom || '',
      'Sexe': e.sexe || '',
      'Âge': e.age || '',
      'Statuts': e.statut || 'N',
      'Lieu de Naissance': e.lieuNaissance || '',
      'Nationalité': e.nationalite || '',
      'Filière': e.filiere || ''
    }));
    
    this.exportService.exportToExcel(
      dataToExport,
      `Liste_Classe_${this.filiereLibelle}_${new Date().toLocaleDateString()}`
    );
  }

  printList(): void {
    window.print();
  }

  countBySexe(sexe: string): number {
    return this.etudiants.filter(e => e.sexe === sexe).length;
  }
}
