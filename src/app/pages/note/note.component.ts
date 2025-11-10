import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnneeScolaire } from '../../models/annee-scolaire';
import { Ue } from '../../models/ue';
import { Filiere } from '../../models/filiere';
import { Note } from '../../models/note';
import { Etudiant } from '../../models/etudiant';
import { AnneeService } from '../../services/annee.service';
import { UeService } from '../../services/ue.service';
import { FiliereService } from '../../services/filiere.service';
import { NoteService } from '../../services/note.service';
import { EtudiantService } from '../../services/etudiant.service';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../shared/components/form/input/input-field.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, FormsModule, LabelComponent, InputFieldComponent, ButtonComponent, PageBreadcrumbComponent],
  templateUrl: './note.component.html',
  styleUrl: './note.component.css'
})
export class NoteComponent implements OnInit {
  activeView: 'add' | 'edit' | 'list' = 'add';
  annees: AnneeScolaire[] = [];
  ues: Ue[] = [];
  filieres: Filiere[] = [];
  etudiants: Etudiant[] = [];
  notes: Note[] = [];
  notesToSave: Note[] = [];

  filter: {
    annee?: AnneeScolaire,
    ue?: Ue,
    filiere?: Filiere,
    session: string,
    periode: number
  } = {
    session: 'Normale',
    periode: 1
  };

  showStudentList: boolean = false;

  constructor(
    private anneeService: AnneeService,
    private ueService: UeService,
    private filiereService: FiliereService,
    private noteService: NoteService,
    private etudiantService: EtudiantService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.anneeService.index().subscribe(data => this.annees = data);
    this.ueService.index().subscribe(data => this.ues = data);
    this.filiereService.index().subscribe(data => this.filieres = data);
  }

  setView(view: 'add' | 'edit' | 'list') {
    this.activeView = view;
    this.showStudentList = false;
  }

  getStudents(): void {
    if (this.filter.filiere) {
      // Assuming the etudiantService has a method to get students by filiere
      // This is a placeholder, the actual implementation might be different
      this.etudiantService.index().subscribe(data => {
        this.etudiants = data.filter(etudiant => etudiant.filiere?.id === (this.filter.filiere as any).id);
        this.showStudentList = true;
        this.initializeNotesToSave();
      });
    }
  }

  initializeNotesToSave(): void {
    this.notesToSave = this.etudiants.map(etudiant => {
      return {
        etudiant: etudiant,
        anneeScolaire: this.filter.annee,
        ue: this.filter.ue,
        filiere: this.filter.filiere,
        session: this.filter.session,
        periode: this.filter.periode,
        cc: 0,
        tp: 0,
        examen: 0
      };
    });
  }

  saveNotes(): void {
    this.notesToSave.forEach(note => {
      const cc = Number(note.cc) || 0;
      const tp = Number(note.tp) || 0;
      const examen = Number(note.examen) || 0;
      note.moyenne = (cc + tp + examen) / 3;
    });

    this.noteService.addNotes(this.notesToSave).subscribe(() => {
      // handle success
      this.showStudentList = false;
    });
  }
}