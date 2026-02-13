import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { TokenDto } from "../models/users/token-dto";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { SingleResponeModel } from "../models/general/single-response.model";
import { Observable, windowTime } from "rxjs";
import { ResponseModel } from "../models/general/response.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private url = environment.apiUrlIdentity + "/user";

    constructor(
        private http: HttpClient,
        public jwtHelper: JwtHelperService
    ) {    
    }

    login = (form: any): Observable<SingleResponeModel<TokenDto>> => 
        this.http.post<SingleResponeModel<TokenDto>>(this.url + "/login", form);

    logout = (): Observable<ResponseModel> =>
        this.http.get<ResponseModel>(this.url + "/logout");

    isAuthentificated(): boolean {
        const sessionStr = localStorage.getItem(environment.authTokenName);
        const session: TokenDto = JSON.parse(sessionStr !== null ? sessionStr : '{}');
        const token = session !== null ? session?.value : null;
        return !this.jwtHelper.isTokenExpired(token!);
    }

    static getUser = (): TokenDto => {
         const sessionStr = localStorage.getItem(environment.authTokenName);
         return JSON.parse(sessionStr !== null ? sessionStr : '{}');
    }

    static logout = () => {
        localStorage.removeItem(environment.authTokenName);
        window.location.href = "/login"
    }
}

export function GetToken(): string {
    const sessionStr = localStorage.getItem(environment.authTokenName);
    const session: TokenDto = JSON.parse(sessionStr != null ? sessionStr : '{}');
    const token = session.value;
    return token ?? "";
}