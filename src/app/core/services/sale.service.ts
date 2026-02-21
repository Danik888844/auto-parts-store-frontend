import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { SaleDto, SaleFormDto } from "../models/sale/sale-dto";
import { ListWithPaginationResponseModel } from "../models/general/list-response.model";
import { SingleResponseModel } from "../models/general/single-response.model";
import { PaginationQueryDto } from "../models/general/pagination-query-dto";

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private url = environment.apiUrlServer + '/sale';

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
  ) {}

  getBy(id: string): Observable<SingleResponseModel<SaleDto>> {
    return this.http.get<SingleResponseModel<SaleDto>>(`${this.url}/${id}`);
  }

  getList(
    form: PaginationQueryDto,
  ): Observable<ListWithPaginationResponseModel<SaleDto>> {
    return this.http.post<ListWithPaginationResponseModel<SaleDto>>(
      `${this.url}/list`,
      form,
    );
  }

  create(body: SaleFormDto): Observable<SingleResponseModel<SaleDto>> {
    return this.http.post<SingleResponseModel<SaleDto>>(this.url, body);
  }

  complete(saleId: string): Observable<SingleResponseModel<SaleDto>> {
    return this.http.post<SingleResponseModel<SaleDto>>(
      `${this.url}/${saleId}/complete`,
      {},
    );
  }

  cancel(saleId: string): Observable<SingleResponseModel<SaleDto>> {
    return this.http.post<SingleResponseModel<SaleDto>>(
      `${this.url}/${saleId}/cancel`,
      {},
    );
  }

  refund(saleId: string): Observable<SingleResponseModel<SaleDto>> {
    return this.http.post<SingleResponseModel<SaleDto>>(
      `${this.url}/${saleId}/refund`,
      {},
    );
  }

  /** quantity (query, optional): 0 или не указано — возврат всей позиции */
  refundItem(
    saleId: string,
    saleItemId: string,
    quantity?: number,
  ): Observable<SingleResponseModel<SaleDto>> {
    const params: Record<string, string> = {};
    if (quantity !== undefined && quantity !== null) {
      params['quantity'] = String(quantity);
    }
    return this.http.post<SingleResponseModel<SaleDto>>(
      `${this.url}/${saleId}/items/${saleItemId}/refund`,
      {},
      Object.keys(params).length ? { params } : {},
    );
  }
}
