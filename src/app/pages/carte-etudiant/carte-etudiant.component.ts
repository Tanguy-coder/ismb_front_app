import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ParcourtService } from '../../services/parcourt.service';
import { EtablissementService } from '../../services/etablissement.service';
import { ListeClasse } from '../../models/liste-classe';
import { Etablissement } from '../../models/etablissement';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-carte-etudiant',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './carte-etudiant.component.html',
  styleUrl: './carte-etudiant.component.css'
})
export class CarteEtudiantComponent implements OnInit {
  etudiants: ListeClasse[] = [];
  etablissement: Etablissement[] = [];
  loading: boolean = true;
  filiereLibelle: string = '';
  anneeCode: string = '';
  filiereId: number = 0;
  anneeScolaireId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private parcourtService: ParcourtService,
    private etablissementService: EtablissementService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filiereId = +params['filiereId'];
      this.anneeScolaireId = +params['anneeScolaireId'];
      this.filiereLibelle = params['filiereLibelle'] || '';
      this.anneeCode = params['anneeCode'] || '';
      
      if (this.filiereId && this.anneeScolaireId) {
        this.loadEtablissement();
        this.loadEtudiants();
      }
    });
  }

  loadEtablissement(): void {
    this.etablissementService.index().subscribe({
      next: (data) => {
        this.etablissement = data;
      }
    });
  }

  loadEtudiants(): void {
    this.loading = true;
    this.parcourtService.getListeClasse(this.filiereId, this.anneeScolaireId).subscribe({
      next: (data) => {
        this.etudiants = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des étudiants:', error);
        this.loading = false;
      }
    });
  }

  getPhotoUrl(photo?: string): string {
    if (!photo) {
      return 'https://via.placeholder.com/150?text=Photo';
    }
    return `http://localhost:8080/uploads/${photo}`;
  }

  getEtablissementLogoUrl(): string {
    if (!this.etablissement[0]?.logo) {
      return '';
    }
    return `http://localhost:8080/uploads/${this.etablissement[0].logo}`;
  }

  onRetour(): void {
    this.router.navigate(['/filiere']);
  }

  onImprimer(): void {
    window.print();
  }

  generateQRCode(matricule?: string): string {
    // Pour simplifier, on utilise une API de génération de QR code
    const data = matricule || 'NO-MATRICULE';
    return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(data)}`;
  }
}
