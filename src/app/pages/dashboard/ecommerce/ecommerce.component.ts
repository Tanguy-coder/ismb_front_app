import { Component, OnInit } from '@angular/core';
import { EtudiantService } from '../../../services/etudiant.service';
import { EnseignantService } from '../../../services/enseignant.service';
import { FiliereService } from '../../../services/filiere.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ecommerce.component.html',
})
export class EcommerceComponent implements OnInit {
  stats = {
    students: 0,
    teachers: 0,
    classes: 0
  };

  constructor(
    private etudiantService: EtudiantService,
    private enseignantService: EnseignantService,
    private filiereService: FiliereService
  ) { }

  ngOnInit() {
    this.etudiantService.index().subscribe(data => this.stats.students = data.length);
    this.enseignantService.index().subscribe(data => this.stats.teachers = data.length);
    this.filiereService.index().subscribe(data => this.stats.classes = data.length);
  }
}
