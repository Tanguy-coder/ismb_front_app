import {Etudiant} from "./etudiant";
import {Ue} from "./ue";
import {AnneeScolaire} from "./annee-scolaire";
import {Filiere} from "./filiere";


export interface Note {
  id?: number;
  etudiant?: Etudiant;
  ue?: Ue;
  anneeScolaire?: AnneeScolaire;
  filiere?: Filiere;
  cc?: number;
  tp?: number;
  examen?: number;
  moyenne?: number;
  session?: string; // Normale ou rattrapage
  periode?: number; // harmattan ou mousson
  mention?: string;
}