import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SalesByPeriodReportComponent } from './report-components/sales-by-period-report/sales-by-period-report.component';
import { TopProductsReportComponent } from './report-components/top-products-report/top-products-report.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    TranslateModule,
    SalesByPeriodReportComponent,
    TopProductsReportComponent,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {}
