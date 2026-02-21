import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { ReportService } from '../../core/services/report.service';
import { SalesByPeriodFilterParams } from '../../core/models/report/sales-by-period-dto';
import { PaymentType } from '../../core/models/sale/payment-type';
import { Download } from '../../core/services/download/download';
import { PopupComponent } from '../general-components/popup/popup.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    NgApexchartsModule,
    PopupComponent,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  filterForm: FormGroup;
  filterPopupOpen = false;
  loading = false;
  exportProgress: Download | null = null;
  loadError = '';
  hasData = false;

  series!: ApexAxisChartSeries;
  chart!: ApexChart;
  dataLabels!: ApexDataLabels;
  markers!: ApexMarkers;
  title!: ApexTitleSubtitle;
  fill!: ApexFill;
  yaxis!: ApexYAxis;
  xaxis!: ApexXAxis;
  tooltip!: ApexTooltip;

  paymentTypes = [
    { value: null as number | null, labelKey: 'NotSelected' },
    { value: PaymentType.Cash, labelKey: 'Cash' },
    { value: PaymentType.Card, labelKey: 'Card' },
    { value: PaymentType.Transfer, labelKey: 'Transfer' },
  ];

  returnsModes = [
    { value: '', labelKey: 'NotSelected' },
    { value: 'Include', labelKey: 'ReturnsMode_Include' },
    { value: 'Exclude', labelKey: 'ReturnsMode_Exclude' },
    { value: 'OnlyReturns', labelKey: 'ReturnsMode_OnlyReturns' },
  ];

  groupByOptions = [
    { value: '', labelKey: 'NotSelected' },
    { value: 'Day', labelKey: 'GroupBy_Day' },
    { value: 'Week', labelKey: 'GroupBy_Week' },
    { value: 'Month', labelKey: 'GroupBy_Month' },
  ];

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    public translateService: TranslateService,
  ) {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.filterForm = this.fb.group({
      dateFrom: [this.formatDateForInput(firstDay)],
      dateTo: [this.formatDateForInput(today)],
      userId: [null as string | null],
      paymentType: [''],
      returnsMode: [''],
      groupBy: ['Day'],
    });
    this.initChartOptions();
  }

  private formatDateForInput(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  getFilterParams(): SalesByPeriodFilterParams {
    const v = this.filterForm.getRawValue();
    return {
      DateFrom: v.dateFrom && String(v.dateFrom).trim() ? String(v.dateFrom).trim() : null,
      DateTo: v.dateTo && String(v.dateTo).trim() ? String(v.dateTo).trim() : null,
      UserId: v.userId && String(v.userId).trim() ? String(v.userId).trim() : null,
      PaymentType: (v.paymentType !== '' && v.paymentType != null) ? Number(v.paymentType) : null,
      ReturnsMode: v.returnsMode && String(v.returnsMode).trim() ? String(v.returnsMode).trim() : null,
      GroupBy: v.groupBy && String(v.groupBy).trim() ? String(v.groupBy).trim() : null,
    };
  }

  loadChart(): void {
    this.loadError = '';
    this.loading = true;
    const params = this.getFilterParams();
    this.reportService.getSalesByPeriod(params).subscribe({
      next: (res) => {
        this.loading = false;
        this.filterPopupOpen = false;
        const data = res.data?.data ?? [];
        this.hasData = Array.isArray(data) && data.length > 0;
        this.series = [
          {
            name: this.translateService.instant('SalesByPeriod'),
            data: this.hasData ? data : [[Date.now(), 0]],
          },
        ];
      },
      error: () => {
        this.loading = false;
        this.loadError = this.translateService.instant('LoadError');
      },
    });
  }

  openFilterPopup(): void {
    this.filterPopupOpen = true;
  }

  closeFilterPopup(): void {
    this.filterPopupOpen = false;
  }

  exportExcel(): void {
    this.exportProgress = { state: 'PENDING', progress: 0, content: null };
    const params = this.getFilterParams();
    this.reportService.getSalesByPeriodExport(params).subscribe({
      next: (ev) => {
        this.exportProgress = ev;
      },
      error: () => {
        this.exportProgress = null;
      },
    });
  }

  private initChartOptions(): void {
    this.series = [
      {
        name: this.translateService.instant('SalesByPeriod'),
        data: [],
      },
    ];
    this.chart = {
      fontFamily: 'Roboto, "Helvetica Neue"',
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: { autoSelected: 'zoom' },
    };
    this.dataLabels = { enabled: false };
    this.markers = { size: 0 };
    this.title = {
      text: this.translateService.instant('SalesByPeriod'),
      align: 'left',
      style: { fontSize: '16px', fontWeight: 600 },
    };
    this.fill = {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    };
    this.yaxis = {
      labels: {
        formatter: (val: number) => (val == null ? '' : String(val)),
      },
      title: { text: '' },
    };
    this.xaxis = { type: 'datetime' };
    this.tooltip = {
      shared: false,
      y: {
        formatter: (val: number) => (val == null ? '' : String(val)),
      },
    };
  }
}
