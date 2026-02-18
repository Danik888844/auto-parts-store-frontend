import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { ResponseModel } from "../models/general/response.model";
import { VehicleDto } from "../models/vehicle/vehicle-dto";
import { ListWithPaginationResponseModel } from '../models/general/list-response.model';
import { SingleResponseModel } from "../models/general/single-response.model";
import { PaginationQueryDto } from "../models/general/pagination-query-dto";

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private url = environment.apiUrlServer + '/vehicle';

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
  ) {}

  getList(
    form: PaginationQueryDto,
  ): Observable<ListWithPaginationResponseModel<VehicleDto>> {
    return this.http.post<ListWithPaginationResponseModel<VehicleDto>>(
      `${this.url}/list`,
      form,
    );
  }

  getBy(id: string): Observable<SingleResponseModel<VehicleDto>> {
    return this.http.get<SingleResponseModel<VehicleDto>>(`${this.url}/${id}`);
  }

  create(form: any): Observable<SingleResponseModel<VehicleDto>> {
    return this.http.post<SingleResponseModel<VehicleDto>>(this.url, form);
  }

  edit(id: string, form: any): Observable<SingleResponseModel<VehicleDto>> {
    return this.http.put<SingleResponseModel<VehicleDto>>(
      `${this.url}/${id}`,
      form,
    );
  }

  delete(id: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.url}/${id}`);
  }
}
