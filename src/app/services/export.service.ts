import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  /**
   * Exporte les données en Excel
   * @param data Les données à exporter (tableau d'objets)
   * @param fileName Le nom du fichier (sans extension)
   * @param headers Les en-têtes personnalisés (optionnel)
   * @param columns Les colonnes avec leurs clés (optionnel)
   */
  exportToExcel(data: any[], fileName: string, headers?: string[], columns?: { key: string, label: string }[]): void {
    if (!data || data.length === 0) {
      console.warn('Aucune donnée à exporter');
      return;
    }

    // Préparer les données
    let exportData: any[] = [];
    
    if (columns && columns.length > 0) {
      // Utiliser les colonnes spécifiées
      exportData = data.map(item => {
        const row: any = {};
        columns.forEach(col => {
          const value = this.getNestedValue(item, col.key);
          row[col.label] = value !== null && value !== undefined ? String(value) : '';
        });
        return row;
      });
    } else if (headers && headers.length > 0) {
      // Utiliser les en-têtes personnalisés avec les clés des objets
      exportData = data.map(item => {
        const row: any = {};
        const keys = Object.keys(item);
        headers.forEach((header, index) => {
          if (keys[index]) {
            row[header] = item[keys[index]];
          }
        });
        return row;
      });
    } else {
      // Utiliser les clés des objets comme en-têtes
      exportData = data;
    }

    // Créer un workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Générer le fichier Excel
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  /**
   * Exporte les données en PDF
   * @param data Les données à exporter (tableau d'objets)
   * @param fileName Le nom du fichier (sans extension)
   * @param title Le titre du document
   * @param columns Les colonnes à afficher avec leurs labels
   */
  exportToPDF(
    data: any[], 
    fileName: string, 
    title: string,
    columns: { key: string, label: string }[]
  ): void {
    const doc = new jsPDF();
    
    // Ajouter le titre
    doc.setFontSize(16);
    doc.text(title, 14, 15);

    // Préparer les données pour le tableau
    const tableData = data.map(item => 
      columns.map(col => {
        const value = this.getNestedValue(item, col.key);
        return value !== null && value !== undefined ? String(value) : '';
      })
    );

    // Préparer les en-têtes
    const tableHeaders = columns.map(col => col.label);

    // Générer le tableau
    (doc as any).autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 25,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Sauvegarder le PDF
    doc.save(`${fileName}.pdf`);
  }

  /**
   * Récupère une valeur imbriquée d'un objet en utilisant une clé avec point (ex: "user.name")
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object') {
        // Gérer les tableaux (ex: "roles[0].name")
        const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);
        if (arrayMatch) {
          const arrayKey = arrayMatch[1];
          const arrayIndex = parseInt(arrayMatch[2]);
          const array = current[arrayKey];
          if (Array.isArray(array) && array[arrayIndex]) {
            return array[arrayIndex];
          }
          return null;
        }
        return current[key];
      }
      return null;
    }, obj);
  }
}
