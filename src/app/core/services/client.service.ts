import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { ResponseModel } from "../models/general/response.model";
import { ClientDto } from "../models/client/client-dto";
import {
  ListWithPaginationResponseModel,
} from '../models/general/list-response.model';
import { SingleResponseModel } from "../models/general/single-response.model";
import { PaginationQueryDto } from "../models/general/pagination-query-dto";

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private url = environment.apiUrlServer + '/client';

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
  ) {}

  getList(
    form: PaginationQueryDto,
  ): Observable<ListWithPaginationResponseModel<ClientDto>> {
    return this.http.post<ListWithPaginationResponseModel<ClientDto>>(
      `${this.url}/list`,
      form,
    );
  }

  getBy(id: string): Observable<SingleResponseModel<ClientDto>> {
    return this.http.get<SingleResponseModel<ClientDto>>(`${this.url}/${id}`);
  }

  create(form: any): Observable<SingleResponseModel<ClientDto>> {
    return this.http.post<SingleResponseModel<ClientDto>>(this.url, form);
  }

  edit(id: string, form: any): Observable<SingleResponseModel<ClientDto>> {
    return this.http.put<SingleResponseModel<ClientDto>>(
      `${this.url}/${id}`,
      form,
    );
  }

  delete(id: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.url}/${id}`);
  }
}
