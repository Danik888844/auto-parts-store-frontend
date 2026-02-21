import { Injectable, Inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { DashboardDto } from '../models/report/dashboard-dto';
import {
  SalesByPeriodFilterParams,
  SalesByPeriodResponse,
} from '../models/report/sales-by-period-dto';
import { SingleResponseModel } from '../models/general/single-response.model';
import { download, Download } from './download/download';
import { SAVER, Saver } from './download/saver.provider';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private url = environment.apiUrlServer + '/report';

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
    @Inject(SAVER) private save: Saver,
  ) {}

  getDashboard(): Observable<SingleResponseModel<DashboardDto>> {
    return this.http.get<SingleResponseModel<DashboardDto>>(
      `${this.url}/dashboard`,
    );
  }

  private buildSalesByPeriodParams(
    params: SalesByPeriodFilterParams,
  ): HttpParams {
    let httpParams = new HttpParams();
    if (params.DateFrom != null && params.DateFrom !== '') {
      httpParams = httpParams.set('DateFrom', params.DateFrom);
    }
    if (params.DateTo != null && params.DateTo !== '') {
      httpParams = httpParams.set('DateTo', params.DateTo);
    }
    if (params.UserId != null && params.UserId !== '') {
      httpParams = httpParams.set('UserId', params.UserId);
    }
    if (params.PaymentType != null) {
      httpParams = httpParams.set('PaymentType', String(params.PaymentType));
    }
    if (params.ReturnsMode != null && params.ReturnsMode !== '') {
      httpParams = httpParams.set('ReturnsMode', params.ReturnsMode);
    }
    if (params.GroupBy != null && params.GroupBy !== '') {
      httpParams = httpParams.set('GroupBy', params.GroupBy);
    }
    return httpParams;
  }

  /**
   * GET api/Report/sales-by-period — данные для графика (сводка + data как SalesByMonth).
   */
  getSalesByPeriod(
    params: SalesByPeriodFilterParams,
  ): Observable<SingleResponseModel<SalesByPeriodResponse>> {
    const httpParams = this.buildSalesByPeriodParams(params);
    return this.http.get<SingleResponseModel<SalesByPeriodResponse>>(
      `${this.url}/sales-by-period`,
      { params: httpParams },
    );
  }

  /**
   * GET api/Report/sales-by-period/export — скачивание sales-by-period_yyyy-MM-dd_HH-mm.xlsx
   */
  getSalesByPeriodExport(
    params: SalesByPeriodFilterParams,
  ): Observable<Download> {
    const httpParams = this.buildSalesByPeriodParams(params);
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const fileName = `sales-by-period_${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}.xlsx`;
    return this.http
      .get(`${this.url}/sales-by-period/export`, {
        params: httpParams,
        reportProgress: true,
        observe: 'events',
        responseType: 'blob',
      })
      .pipe(download((blob) => this.save(blob, fileName)));
  }
}
