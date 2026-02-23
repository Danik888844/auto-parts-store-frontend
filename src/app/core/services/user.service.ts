import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { TokenDto } from "../models/users/token-dto";
import { UserDto } from '../models/users/user-dto';
import { ChangeUserRoleFormDto } from '../models/users/change-user-role-form-dto';
import { CreateUserDto } from '../models/users/create-user-dto';
import { EditUserDto } from '../models/users/edit-user-dto';
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { SingleResponseModel } from '../models/general/single-response.model';
import {
  ListResponseModel,
  ListWithPaginationResponseModel,
} from '../models/general/list-response.model';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/general/response.model';
import { PaginationQueryDto } from '../models/general/pagination-query-dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = environment.apiUrlIdentity + '/user';

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
  ) {}

  login = (form: any): Observable<SingleResponseModel<TokenDto>> =>
    this.http.post<SingleResponseModel<TokenDto>>(this.url + '/login', form);

  logout = (): Observable<ResponseModel> =>
    this.http.get<ResponseModel>(this.url + '/logout');

  getUsers = (
    form: PaginationQueryDto,
  ): Observable<ListWithPaginationResponseModel<UserDto>> =>
    this.http.post<ListWithPaginationResponseModel<UserDto>>(
      this.url + '/list',
      form,
    );

  changeRole = (form: ChangeUserRoleFormDto): Observable<ResponseModel> =>
    this.http.post<ResponseModel>(this.url + '/role', form);

  create = (form: CreateUserDto): Observable<SingleResponseModel<UserDto>> =>
    this.http.post<SingleResponseModel<UserDto>>(this.url, form);

  edit = (id: string, form: EditUserDto): Observable<SingleResponseModel<UserDto>> =>
    this.http.put<SingleResponseModel<UserDto>>(this.url + '/' + id, form);

  isAuthentificated(): boolean {
    const sessionStr = localStorage.getItem(environment.authTokenName);
    const session: TokenDto = JSON.parse(
      sessionStr !== null ? sessionStr : '{}',
    );
    const token = session !== null ? session?.value : null;
    return !this.jwtHelper.isTokenExpired(token!);
  }

  static getUser = (): TokenDto => {
    const sessionStr = localStorage.getItem(environment.authTokenName);
    return JSON.parse(sessionStr !== null ? sessionStr : '{}');
  };

  isAdmin = (): boolean =>
    UserService.getUser()?.user?.roles?.includes('Administrator') ?? false;

  static logout = () => {
    localStorage.removeItem(environment.authTokenName);
    window.location.href = '/login';
  };
}

export function GetToken(): string {
    const sessionStr = localStorage.getItem(environment.authTokenName);
    const session: TokenDto = JSON.parse(sessionStr != null ? sessionStr : '{}');
    const token = session.value;
    return token ?? "";
}