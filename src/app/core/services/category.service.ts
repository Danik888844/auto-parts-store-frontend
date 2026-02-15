import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { ResponseModel } from "../models/general/response.model";
import { CategoryDto } from "../models/category/category-dto";
import { ListResponseModel } from "../models/general/list-response.model";
import { SingleResponseModel } from "../models/general/single-response.model";
import { PaginationQueryDto } from "../models/general/pagination-query-dto";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private url = environment.apiUrlServer + "/category";

    constructor(
        private http: HttpClient,
        public jwtHelper: JwtHelperService
    ) {    
    }

   getList(
    form: PaginationQueryDto
  ): Observable<ListResponseModel<CategoryDto>> {
    return this.http.post<ListResponseModel<CategoryDto>>(`${this.url}/list`, form);
  }

  getBy(id: string): Observable<SingleResponseModel<CategoryDto>> {
    return this.http.get<SingleResponseModel<CategoryDto>>(
      `${this.url}/${id}`,
    );
  }

  create(form: any): Observable<SingleResponseModel<CategoryDto>> {
    return this.http.post<SingleResponseModel<CategoryDto>>(this.url, form);
  }

  edit(id: string, form: any): Observable<SingleResponseModel<CategoryDto>> {
    return this.http.put<SingleResponseModel<CategoryDto>>(`${this.url}/${id}`, form);
  }

  delete(id: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.url}/${id}`);
  }
}
