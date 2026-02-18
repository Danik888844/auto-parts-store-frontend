import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { ResponseModel } from "../models/general/response.model";
import { VehicleModelDto } from "../models/vehicle-model/vehicle-model-dto";
import { ListWithPaginationResponseModel } from '../models/general/list-response.model';
import { SingleResponseModel } from "../models/general/single-response.model";
import { PaginationQueryDto } from "../models/general/pagination-query-dto";

@Injectable({
  providedIn: 'root',
})
export class VehicleModelService {
  private url = environment.apiUrlServer + '/vehicle-model';

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
  ) {}

  getList(
    form: PaginationQueryDto,
  ): Observable<ListWithPaginationResponseModel<VehicleModelDto>> {
    return this.http.post<ListWithPaginationResponseModel<VehicleModelDto>>(
      `${this.url}/list`,
      form,
    );
  }

  getBy(id: string): Observable<SingleResponseModel<VehicleModelDto>> {
    return this.http.get<SingleResponseModel<VehicleModelDto>>(`${this.url}/${id}`);
  }

  create(form: any): Observable<SingleResponseModel<VehicleModelDto>> {
    return this.http.post<SingleResponseModel<VehicleModelDto>>(this.url, form);
  }

  edit(id: string, form: any): Observable<SingleResponseModel<VehicleModelDto>> {
    return this.http.put<SingleResponseModel<VehicleModelDto>>(
      `${this.url}/${id}`,
      form,
    );
  }

  delete(id: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.url}/${id}`);
  }
}
