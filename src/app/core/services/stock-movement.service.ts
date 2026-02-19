import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { StockMovementDto } from "../models/stock-movement/stock-movement-dto";
import { StockMovementType } from "../models/stock-movement/stock-movement-type";
import { ListWithPaginationResponseModel } from "../models/general/list-response.model";
import { SingleResponseModel } from "../models/general/single-response.model";
import { PaginationQueryDto } from "../models/general/pagination-query-dto";

export interface CreateStockMovementDto {
  productId: number;
  type: StockMovementType;
  quantity: number;
  reason?: string | null;
  documentNo?: string | null;
  supplierId?: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class StockMovementService {
  private url = environment.apiUrlServer + '/stock-movement';

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
  ) {}

  getBy(id: string): Observable<SingleResponseModel<StockMovementDto>> {
    return this.http.get<SingleResponseModel<StockMovementDto>>(
      `${this.url}/${id}`,
    );
  }

  getList(
    form: PaginationQueryDto,
  ): Observable<ListWithPaginationResponseModel<StockMovementDto>> {
    return this.http.post<ListWithPaginationResponseModel<StockMovementDto>>(
      `${this.url}/list`,
      form,
    );
  }

  create(
    body: CreateStockMovementDto,
  ): Observable<SingleResponseModel<StockMovementDto>> {
    return this.http.post<SingleResponseModel<StockMovementDto>>(
      this.url,
      body,
    );
  }
}
