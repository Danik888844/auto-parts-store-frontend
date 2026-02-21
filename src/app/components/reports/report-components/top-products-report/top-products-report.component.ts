import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexXAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { ColDef, GridOptions } from 'ag-grid-community';
import { ReportService } from '../../../../core/services/report.service';
import { CategoryService } from '../../../../core/services/category.service';
import { ManufacturerService } from '../../../../core/services/manufacturer.service';
import { TopProductsTableRow } from '../../../../core/models/report/top-products-dto';
import { AgGridListComponent } from '../../../general-components/ag-grid-list/ag-grid-list.component';
import { CustomSelectComponent } from '../../../general-components/custom-select/custom-select.component';

@Component({
  selector: 'app-top-products-report',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    NgApexchartsModule,
    AgGridListComponent,
    CustomSelectComponent,
  ],
  templateUrl: './top-products-report.component.html',
  styleUrl: './top-products-report.component.scss',
})
export class TopProductsReportComponent implements OnInit {
  filterForm: FormGroup;
  loading = false;
  loadError = '';

  chartSeries: ApexAxisChartSeries = [{ name: '', data: [0] }];
  chartOptions: ApexChart = { type: 'bar', height: 400 };
  chartXaxis: ApexXAxis = { categories: ['—'] };
  chartDataLabels: ApexDataLabels = { enabled: true };
  chartTitle: ApexTitleSubtitle = { text: '' };

  tableData: TopProductsTableRow[] = [];
  colDefs: ColDef[] = [];
  gridOptions: GridOptions = { suppressCellFocus: true };

  categoryOptions: { id: string; name: string }[] = [];
  manufacturerOptions: { id: string; name: string }[] = [];
  orderByOptions = [
    { value: 0, labelKey: 'ByQuantity' },
    { value: 1, labelKey: 'ByRevenue' },
  ];

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService,
    public translateService: TranslateService,
  ) {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.filterForm = this.fb.group({
      dateFrom: [this.formatDateForInput(firstDay)],
      dateTo: [this.formatDateForInput(today)],
      categoryId: [null as string | null],
      manufacturerId: [null as string | null],
      orderBy: [0],
    });
    this.initColDefs();
  }

  ngOnInit(): void {
    this.loadCategories('');
    this.loadManufacturers('');
    this.loadReport();
  }

  private formatDateForInput(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  loadCategories(searchTerm: string): void {
    this.categoryService.getList({ viewSize: 20, pageNumber: 1, search: searchTerm ?? '' }).subscribe({
      next: (res) => {
        const items = res.data?.items ?? [];
        this.categoryOptions = items.map((c: { id?: string; name?: string }) => ({
          id: String(c.id ?? ''),
          name: c.name ?? '',
        }));
      },
    });
  }

  loadManufacturers(searchTerm: string): void {
    this.manufacturerService.getList({ viewSize: 20, pageNumber: 1, search: searchTerm ?? '' }).subscribe({
      next: (res) => {
        const items = res.data?.items ?? [];
        this.manufacturerOptions = items.map((m: { id?: string; name?: string }) => ({
          id: String(m.id ?? ''),
          name: m.name ?? '',
        }));
      },
    });
  }

  private initColDefs(): void {
    this.colDefs = [
      { field: 'sku', headerName: this.translateService.instant('Sku'), flex: 1, minWidth: 100 },
      { field: 'name', headerName: this.translateService.instant('Name'), flex: 1, minWidth: 150 },
      {
        field: 'qty',
        headerName: this.translateService.instant('Quantity'),
        flex: 1,
        minWidth: 80,
        valueFormatter: (p) => (p.value != null ? String(p.value) : ''),
      },
      {
        field: 'revenue',
        headerName: this.translateService.instant('Revenue'),
        flex: 1,
        minWidth: 100,
        valueFormatter: (p) => (p.value != null ? Number(p.value).toLocaleString() : ''),
      },
    ];
  }

  getParams(): {
    DateFrom: string | null;
    DateTo: string | null;
    CategoryId: string | null;
    ManufacturerId: string | null;
    OrderBy: number;
  } {
    const v = this.filterForm.getRawValue();
    return {
      DateFrom: v.dateFrom && String(v.dateFrom).trim() ? String(v.dateFrom).trim() : null,
      DateTo: v.dateTo && String(v.dateTo).trim() ? String(v.dateTo).trim() : null,
      CategoryId: (v.categoryId != null && String(v.categoryId).trim() !== '') ? String(v.categoryId).trim() : null,
      ManufacturerId: (v.manufacturerId != null && String(v.manufacturerId).trim() !== '') ? String(v.manufacturerId).trim() : null,
      OrderBy: v.orderBy != null ? Number(v.orderBy) : 0,
    };
  }

  loadReport(): void {
    this.loadError = '';
    this.loading = true;
    const params = this.getParams();
    this.reportService.getTopProducts(params).subscribe({
      next: (res) => {
        this.loading = false;
        const data = res.data;
        const chartData = Array.isArray(data?.chartData) ? data.chartData : [];
        const table = Array.isArray(data?.table) ? data.table : [];
        const hasChartData = chartData.length > 0;
        this.chartSeries = [
          {
            name: this.translateService.instant('TopProducts'),
            data: hasChartData ? chartData.map((d) => d.y) : [0],
          },
        ];
        this.chartXaxis = {
          categories: hasChartData ? chartData.map((d) => d.x) : ['—'],
        };
        this.chartTitle = {
          text: '',
          align: 'left',
          style: { fontSize: '14px', fontWeight: 600 },
        };
        this.tableData = table;
      },
      error: () => {
        this.loading = false;
        this.loadError = this.translateService.instant('LoadError');
      },
    });
  }
}
