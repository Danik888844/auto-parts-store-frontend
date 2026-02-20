import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
import { MatIconModule } from '@angular/material/icon';
import { ReportService } from '../../core/services/report.service';
import { DashboardDto } from '../../core/models/report/dashboard-dto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, NgApexchartsModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  /** Данные с бэка; до загрузки — нули */
  data: DashboardDto = {
    salesTodayCount: 0,
    salesTodayTotal: 0,
    incomeForWeek: 0,
    stockPositionsCount: 0,
    stockTotalQuantity: 0,
    clientsCount: 0,
    salesByMonth: [],
  };
  loading = true;
  loadError = false;

  blueWaveUrl = '/assets/images/svg-waves/blue-wave.svg';
  cyanWaveUrl = '/assets/images/svg-waves/cyan-wave.svg';
  aquaWaveUrl = '/assets/images/svg-waves/aqua-wave.svg';
  peachWaveUrl = '/assets/images/svg-waves/peach-wave.svg';

  series!: ApexAxisChartSeries;
  chart!: ApexChart;
  dataLabels!: ApexDataLabels;
  markers!: ApexMarkers;
  title!: ApexTitleSubtitle;
  fill!: ApexFill;
  yaxis!: ApexYAxis;
  xaxis!: ApexXAxis;
  tooltip!: ApexTooltip;

  constructor(
    public translateService: TranslateService,
    private reportService: ReportService,
  ) {
    this.initChartOptions();
  }

  ngOnInit(): void {
    this.reportService.getDashboard().subscribe({
      next: (res) => {
        if (res.data) {
          this.data = res.data;
          this.applySalesByMonthToChart(res.data.salesByMonth ?? []);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.loadError = true;
      },
    });
  }

  private applySalesByMonthToChart(salesByMonth: number[][]): void {
    const points = Array.isArray(salesByMonth) ? salesByMonth : [];
    this.series = [
      {
        name: this.translateService.instant('SalesPerMonth'),
        data: points.length ? points : [[Date.now(), 0]],
      },
    ];
  }

  private initChartOptions(): void {
    this.series = [
      {
        name: this.translateService.instant('SalesPerMonth'),
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
      toolbar: {
        autoSelected: 'zoom',
      },
    };
    this.dataLabels = {
      enabled: false,
    };
    this.markers = {
      size: 0,
    };
    this.title = {
      text: this.translateService.instant('SalesPerMonth'),
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
      title: {
        text: '',
      },
    };
    this.xaxis = {
      type: 'datetime',
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: (val: number) => (val == null ? '' : String(val)),
      },
    };
  }
}
