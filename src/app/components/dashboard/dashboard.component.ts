import { Component } from '@angular/core';
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslateModule, NgApexchartsModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  salesCount: number = 0;

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

  dataSeries = [
    [
      {
        date: '2014-01-01',
        value: 20000000,
      },
      {
        date: '2014-01-02',
        value: 10379978,
      },
      {
        date: '2014-01-03',
        value: 30493749,
      },
      {
        date: '2014-01-04',
        value: 10785250,
      },
      {
        date: '2014-01-05',
        value: 33901904,
      },
      {
        date: '2014-01-06',
        value: 11576838,
      },
      {
        date: '2014-01-07',
        value: 14413854,
      },
      {
        date: '2014-01-08',
        value: 15177211,
      },
      {
        date: '2014-01-09',
        value: 16622100,
      },
      {
        date: '2014-01-10',
        value: 17381072,
      },
      {
        date: '2014-01-11',
        value: 18802310,
      },
      {
        date: '2014-01-12',
        value: 15531790,
      },
      {
        date: '2014-01-13',
        value: 15748881,
      },
      {
        date: '2014-01-14',
        value: 18706437,
      },
    ],
  ];

  constructor(private translateService: TranslateService) {
    this.initChartData();
  }

  public initChartData(): void {
    const sourceData = this.dataSeries[0];
    let ts2 = 1484418600000;
    const dates = [];
    for (let i = 0; i < 120; i++) {
      ts2 = ts2 + 86400000;
      const item = sourceData[i % sourceData.length];
      dates.push([ts2, item.value]);
    }

    this.series = [
      {
        name: 'XYZ MOTORS',
        data: dates,
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
        formatter: function (val) {
          return (val / 1000000).toFixed(0);
        },
      },
      title: {
        text: 'Price',
      },
    };
    this.xaxis = {
      type: 'datetime',
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function (val) {
          return (val / 1000000).toFixed(0);
        },
      },
    };
  }
}
