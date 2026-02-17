import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { ResponseModel } from "../models/general/response.model";
import { ManufacturerDto } from "../models/manufacturer/manufacturer-dto";
import {
  ListWithPaginationResponseModel,
} from '../models/general/list-response.model';
import { SingleResponseModel } from "../models/general/single-response.model";
import { PaginationQueryDto } from "../models/general/pagination-query-dto";

@Injectable({
  providedIn: 'root',
})
export class ManufacturerService {
  private url = environment.apiUrlServer + '/manufacturer';

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
  ) {}

  getList(
    form: PaginationQueryDto,
  ): Observable<ListWithPaginationResponseModel<ManufacturerDto>> {
    return this.http.post<ListWithPaginationResponseModel<ManufacturerDto>>(
      `${this.url}/list`,
      form,
    );
  }

  getBy(id: string): Observable<SingleResponseModel<ManufacturerDto>> {
    return this.http.get<SingleResponseModel<ManufacturerDto>>(`${this.url}/${id}`);
  }

  create(form: any): Observable<SingleResponseModel<ManufacturerDto>> {
    return this.http.post<SingleResponseModel<ManufacturerDto>>(this.url, form);
  }

  edit(id: string, form: any): Observable<SingleResponseModel<ManufacturerDto>> {
    return this.http.put<SingleResponseModel<ManufacturerDto>>(
      `${this.url}/${id}`,
      form,
    );
  }

  delete(id: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.url}/${id}`);
  }
}
