import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { ResponseModel } from "../models/general/response.model";
import { VehicleBrandDto } from "../models/vehicle-brand/vehicle-brand-dto";
import { ListWithPaginationResponseModel } from '../models/general/list-response.model';
import { SingleResponseModel } from "../models/general/single-response.model";
import { PaginationQueryDto } from "../models/general/pagination-query-dto";

@Injectable({
  providedIn: 'root',
})
export class VehicleBrandService {
  private url = environment.apiUrlServer + '/vehicle-brand';

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
  ) {}

  getList(
    form: PaginationQueryDto,
  ): Observable<ListWithPaginationResponseModel<VehicleBrandDto>> {
    return this.http.post<ListWithPaginationResponseModel<VehicleBrandDto>>(
      `${this.url}/list`,
      form,
    );
  }

  getBy(id: string): Observable<SingleResponseModel<VehicleBrandDto>> {
    return this.http.get<SingleResponseModel<VehicleBrandDto>>(`${this.url}/${id}`);
  }

  create(form: any): Observable<SingleResponseModel<VehicleBrandDto>> {
    return this.http.post<SingleResponseModel<VehicleBrandDto>>(this.url, form);
  }

  edit(id: string, form: any): Observable<SingleResponseModel<VehicleBrandDto>> {
    return this.http.put<SingleResponseModel<VehicleBrandDto>>(
      `${this.url}/${id}`,
      form,
    );
  }

  delete(id: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.url}/${id}`);
  }
}
