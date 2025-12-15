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
import {NotificationService} from "../../services/notification.service";

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
    periode: number,
    code: string
  } = {
    session: 'Normale',
    periode: 1,
    code: ''
  };

  showStudentList: boolean = false;

  constructor(
    private anneeService: AnneeService,
    private ueService: UeService,
    private filiereService: FiliereService,
    private noteService: NoteService,
    private etudiantService: EtudiantService,
    private notificationService: NotificationService
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
    // reset lists when switching views
    if (view === 'list') {
      this.notes = [];
    } else {
      this.notesToSave = [];
    }
  }

  onSubmit() {
    if (this.activeView === 'add') {
        if (!this.validator()) return;
        if (this.filter.code != this.ues.find(ue => ue.id === this.filter.ue?.id)?.code) {
            return this.notificationService.showWarning("Le code de l'UE n'est pas correct.");
        }
        this.getStudents();
    } else if (this.activeView === 'edit') {
        this.getStudentsNotesToEdit();
    } else if (this.activeView === 'list') {
        this.getStudentsNotes();
    }
  }

  getStudents(): void {
    if (this.filter.filiere) {
      this.etudiantService.index().subscribe(data => {
        this.etudiants = data.filter(etudiant => etudiant.filiere?.id === (this.filter.filiere as any).id);
        this.showStudentList = true;
        this.initializeNotesToSave();
      });
    }
  }

  getStudentsNotes(): void{
    const params = this.toParams();
    this.noteService.searchNotes(params).subscribe(notes => {
      this.notes = notes;
      this.showStudentList = true;
    });
  }

  getStudentsNotesToEdit(): void{
    const params = this.toParams();
    this.noteService.searchNotes(params).subscribe(notes => {
      // Prepare editable notes list
      this.notesToSave = notes.map(n => ({ ...n }));
      this.showStudentList = true;
    });
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
        examen: 0,
        code: this.filter.code
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

validator(): boolean {
    const { ue, annee, filiere, periode, session, code } = this.filter;

    if (!ue || !annee || !filiere || !periode || !session || !code) {
        this.notificationService.showWarning("Veuillez renseigner tous les champs obligatoires.");
        return false;
    }
    this.notificationService.showSuccess("Ok !");
    return true;
}


  updateNotes(): void {
    this.notesToSave.forEach(note => {
      const cc = Number(note.cc) || 0;
      const tp = Number(note.tp) || 0;
      const examen = Number(note.examen) || 0;
      note.moyenne = (cc + tp + examen) / 3;
    });

    this.noteService.updateNote(this.notesToSave).subscribe(() =>{

    });

  }

  // Helpers
  private toParams() {
    return {
      anneeId: this.filter.annee?.id as any,
      filiereId: this.filter.filiere?.id as any,
      ueId: this.filter.ue?.id as any,
      session: this.filter.session,
      periode: this.filter.periode,
    };
  }

  compareById = (a?: { id?: number }, b?: { id?: number }) => a?.id === b?.id;

  trackByStudent = (_: number, n: Note) => n.etudiant?.id;
}