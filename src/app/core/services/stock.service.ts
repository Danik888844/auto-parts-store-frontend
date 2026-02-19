import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { StockDto } from "../models/stock/stock-dto";
import { ListWithPaginationResponseModel } from "../models/general/list-response.model";
import { SingleResponseModel } from "../models/general/single-response.model";
import { PaginationQueryDto } from "../models/general/pagination-query-dto";

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private url = environment.apiUrlServer + '/stock';

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
  ) {}

  // остаток по товару
  getByProduct(productId: number): Observable<SingleResponseModel<StockDto>> {
    return this.http.get<SingleResponseModel<StockDto>>(
      `${this.url}/by-product/${productId}`,
    );
  }

  getList(
    form: PaginationQueryDto,
  ): Observable<ListWithPaginationResponseModel<StockDto>> {
    return this.http.post<ListWithPaginationResponseModel<StockDto>>(
      `${this.url}/list`,
      form,
    );
  }
}
