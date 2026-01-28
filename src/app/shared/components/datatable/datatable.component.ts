import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ExportService } from '../../../services/export.service';
import { ButtonComponent } from '../ui/button/button.component';

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => string;
  isAction?: boolean;
}

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: DataTableColumn[] = [];
  @Input() title: string = 'Tableau de données';
  @Input() fileName: string = 'export';
  @Input() showExportButtons: boolean = true;
  @Input() searchPlaceholder: string = 'Rechercher...';
  @Input() pageSize: number = 10;
  @Input() actionTemplate?: TemplateRef<any>;
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  
  filteredData: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  pageSizes: number[] = [10, 25, 50, 100];
  
  // Pour stocker la ligne actuelle dans le template d'actions
  currentRow: any = null;

  constructor(
    private exportService: ExportService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.filteredData = [...this.data];
    this.updatePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.filteredData = [...this.data];
      this.applySearch();
      this.updatePagination();
    }
  }

  applySearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredData = [...this.data];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredData = this.data.filter(row => {
        return this.columns.some(col => {
          const value = this.getNestedValue(row, col.key);
          return value !== null && value !== undefined && 
                 String(value).toLowerCase().includes(term);
        });
      });
    }
    this.currentPage = 1;
    this.updatePagination();
    this.applySorting();
  }

  sort(column: DataTableColumn): void {
    if (!column.sortable) return;
    
    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }
    
    this.applySorting();
  }

  private applySorting(): void {
    if (!this.sortColumn) return;

    this.filteredData.sort((a, b) => {
      const aValue = this.getNestedValue(a, this.sortColumn);
      const bValue = this.getNestedValue(b, this.sortColumn);
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      const comparison = String(aValue).localeCompare(String(bValue));
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
    
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredData.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.updatePagination();
  }

  exportToExcel(): void {
    const columns = this.columns.map(col => ({
      key: col.key,
      label: col.label
    }));
    this.exportService.exportToExcel(this.filteredData, this.fileName, undefined, columns);
  }

  exportToPDF(): void {
    const columns = this.columns.map(col => ({
      key: col.key,
      label: col.label
    }));
    this.exportService.exportToPDF(this.filteredData, this.fileName, this.title, columns);
  }

  getCellValue(row: any, column: DataTableColumn): SafeHtml | string {
    if (column.isAction && this.actionTemplate) {
      return ''; // Les actions seront gérées par le template
    }
    if (column.render) {
      const htmlResult = column.render(this.getNestedValue(row, column.key), row);
      // Si le résultat contient du HTML (balises), le marquer comme sûr
      if (htmlResult && htmlResult.includes('<')) {
        return this.sanitizer.bypassSecurityTrustHtml(htmlResult);
      }
      return htmlResult;
    }
    const value = this.getNestedValue(row, column.key);
    return value !== null && value !== undefined ? String(value) : '';
  }

  handleEdit(row: any): void {
    this.onEdit.emit(row);
  }

  handleDelete(row: any): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      this.onDelete.emit(row);
    }
  }

  getSortIcon(column: DataTableColumn): string {
    if (this.sortColumn !== column.key) return '↕';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  get Math() {
    return Math;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object') {
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

