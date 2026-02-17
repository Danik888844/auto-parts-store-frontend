import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { ResponseModel } from "../models/general/response.model";
import { SupplierDto } from "../models/supplier/supplier-dto";
import {
  ListWithPaginationResponseModel,
} from '../models/general/list-response.model';
import { SingleResponseModel } from "../models/general/single-response.model";
import { PaginationQueryDto } from "../models/general/pagination-query-dto";

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private url = environment.apiUrlServer + '/supplier';

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
  ) {}

  getList(
    form: PaginationQueryDto,
  ): Observable<ListWithPaginationResponseModel<SupplierDto>> {
    return this.http.post<ListWithPaginationResponseModel<SupplierDto>>(
      `${this.url}/list`,
      form,
    );
  }

  getBy(id: string): Observable<SingleResponseModel<SupplierDto>> {
    return this.http.get<SingleResponseModel<SupplierDto>>(`${this.url}/${id}`);
  }

  create(form: any): Observable<SingleResponseModel<SupplierDto>> {
    return this.http.post<SingleResponseModel<SupplierDto>>(this.url, form);
  }

  edit(id: string, form: any): Observable<SingleResponseModel<SupplierDto>> {
    return this.http.put<SingleResponseModel<SupplierDto>>(
      `${this.url}/${id}`,
      form,
    );
  }

  delete(id: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.url}/${id}`);
  }
}
