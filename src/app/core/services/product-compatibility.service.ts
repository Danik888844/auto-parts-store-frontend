import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { ResponseModel } from "../models/general/response.model";
import { ProductCompatibilityDto } from "../models/product-compatibility/product-compatibility-dto";
import { ListWithPaginationResponseModel } from '../models/general/list-response.model';
import { SingleResponseModel } from "../models/general/single-response.model";
import { PaginationQueryDto } from "../models/general/pagination-query-dto";

@Injectable({
  providedIn: 'root',
})
export class ProductCompatibilityService {
  private url = environment.apiUrlServer + '/product-compatibility';

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
  ) {}

  getList(
    form: PaginationQueryDto,
  ): Observable<ListWithPaginationResponseModel<ProductCompatibilityDto>> {
    return this.http.post<ListWithPaginationResponseModel<ProductCompatibilityDto>>(
      `${this.url}/list`,
      form,
    );
  }

  getBy(id: string): Observable<SingleResponseModel<ProductCompatibilityDto>> {
    return this.http.get<SingleResponseModel<ProductCompatibilityDto>>(`${this.url}/${id}`);
  }

  create(form: { productId: string; vehicleId: string; comment?: string | null }): Observable<SingleResponseModel<ProductCompatibilityDto>> {
    return this.http.post<SingleResponseModel<ProductCompatibilityDto>>(this.url, form);
  }

  edit(
    id: string,
    form: { productId: string; vehicleId: string; comment?: string | null },
  ): Observable<SingleResponseModel<ProductCompatibilityDto>> {
    return this.http.put<SingleResponseModel<ProductCompatibilityDto>>(
      `${this.url}/${id}`,
      form,
    );
  }

  delete(id: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.url}/${id}`);
  }
}
