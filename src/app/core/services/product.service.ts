import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { ResponseModel } from "../models/general/response.model";
import { ProductDto } from "../models/product/product-dto";
import {
  ListWithPaginationResponseModel,
} from '../models/general/list-response.model';
import { SingleResponseModel } from "../models/general/single-response.model";
import { PaginationQueryDto } from "../models/general/pagination-query-dto";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = environment.apiUrlServer + '/product';

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
  ) {}

  getList(
    form: PaginationQueryDto,
  ): Observable<ListWithPaginationResponseModel<ProductDto>> {
    return this.http.post<ListWithPaginationResponseModel<ProductDto>>(
      `${this.url}/list`,
      form,
    );
  }

  getBy(id: string): Observable<SingleResponseModel<ProductDto>> {
    return this.http.get<SingleResponseModel<ProductDto>>(`${this.url}/${id}`);
  }

  checkSkuExists(
    sku: string,
    excludeId?: string,
  ): Observable<SingleResponseModel<{ exists: boolean }>> {
    let params: { sku: string; excludeId?: string } = { sku };
    if (excludeId) params.excludeId = excludeId;
    return this.http.get<SingleResponseModel<{ exists: boolean }>>(
      `${this.url}/check-sku`,
      { params: params as any },
    );
  }

  create(form: any): Observable<SingleResponseModel<ProductDto>> {
    return this.http.post<SingleResponseModel<ProductDto>>(this.url, form);
  }

  edit(id: string, form: any): Observable<SingleResponseModel<ProductDto>> {
    return this.http.put<SingleResponseModel<ProductDto>>(
      `${this.url}/${id}`,
      form,
    );
  }

  delete(id: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.url}/${id}`);
  }
}
