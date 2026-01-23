import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportService } from '../../../services/export.service';
import { ButtonComponent } from '../ui/button/button.component';

declare var $: any;

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() data: any[] = [];
  @Input() columns: DataTableColumn[] = [];
  @Input() title: string = 'Tableau de données';
  @Input() filename: string = 'export';
  @Input() showExport: boolean = true;
  @Input() pageLength: number = 10;
  @Input() searchPlaceholder: string = 'Rechercher...';

  @ViewChild('dataTable', { static: false }) tableRef!: ElementRef;
  
  private dataTable: any;
  private tableInitialized = false;

  constructor(
    private exportService: ExportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // S'assurer que les données sont disponibles
    if (this.data && this.data.length > 0 && !this.tableInitialized) {
      setTimeout(() => this.initDataTable(), 100);
    }
  }

  ngAfterViewInit(): void {
    if (this.data && this.data.length > 0 && !this.tableInitialized) {
      setTimeout(() => this.initDataTable(), 100);
    }
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }

  ngOnChanges(): void {
    if (this.tableInitialized && this.dataTable) {
      this.dataTable.clear();
      this.dataTable.rows.add(this.data);
      this.dataTable.draw();
    } else if (this.data && this.data.length > 0) {
      setTimeout(() => this.initDataTable(), 100);
    }
  }

  private initDataTable(): void {
    if (!this.tableRef || this.tableInitialized) return;

    const tableElement = $(this.tableRef.nativeElement);
    
    this.dataTable = tableElement.DataTable({
      data: this.data,
      columns: this.columns.map(col => ({
        data: col.key,
        title: col.label,
        orderable: col.sortable !== false,
        render: col.render || ((data: any) => data !== null && data !== undefined ? String(data) : '')
      })),
      pageLength: this.pageLength,
      language: {
        search: '',
        searchPlaceholder: this.searchPlaceholder,
        lengthMenu: 'Afficher _MENU_ entrées',
        info: 'Affichage de _START_ à _END_ sur _TOTAL_ entrées',
        infoEmpty: 'Aucune entrée à afficher',
        infoFiltered: '(filtré à partir de _MAX_ entrées au total)',
        paginate: {
          first: 'Premier',
          last: 'Dernier',
          next: 'Suivant',
          previous: 'Précédent'
        }
      },
      dom: '<"flex flex-col gap-2 px-5 mb-4 sm:flex-row sm:items-center sm:justify-between"<"flex items-center gap-2"l><"flex items-center gap-2"f>>rt<"flex flex-col gap-2 px-5 mt-4 sm:flex-row sm:items-center sm:justify-between"<"flex items-center"i><"flex items-center"p>>',
      responsive: true,
      order: [[0, 'asc']]
    });

    this.tableInitialized = true;
    this.cdr.detectChanges();
  }

  exportToExcel(): void {
    const columns = this.columns.map(col => ({ key: col.key, label: col.label }));
    this.exportService.exportToExcel(this.data, this.filename, undefined, columns);
  }

  exportToPDF(): void {
    const columns = this.columns.map(col => ({ key: col.key, label: col.label }));
    this.exportService.exportToPDF(this.data, this.filename, this.title, columns);
  }
}

