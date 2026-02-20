import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { DashboardDto } from '../models/report/dashboard-dto';
import { SingleResponseModel } from '../models/general/single-response.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private url = environment.apiUrlServer + '/report';

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
  ) {}

  /** GET /report/dashboard — данные для дашборда */
  getDashboard(): Observable<SingleResponseModel<DashboardDto>> {
    return this.http.get<SingleResponseModel<DashboardDto>>(`${this.url}/dashboard`);
  }
}
