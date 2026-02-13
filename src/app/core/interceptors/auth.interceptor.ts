import {Injectable, inject} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {Observable, catchError, throwError} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {environment} from "../../../environments/environment";
import { TokenDto } from '../models/users/token-dto';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  route = inject(ActivatedRoute);

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const localStorageStr =
    localStorage.getItem(environment.authTokenName) ??
    localStorage.getItem(environment.recoveryToken);
    if (!localStorageStr) return next.handle(request);
    const sessionStr: TokenDto = JSON.parse(localStorageStr);
    if (!sessionStr) return next.handle(request);

    const token = sessionStr?.value;

    if (!!request.headers.get('Authorization'))
    return next.handle(request);

    if (token)
    return next.handle(request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
    })).pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error?.error?.message?.includes("Login required.")) {
        const snapshot: any = this.route.snapshot;
        const redirect_url = snapshot?.['_routerState']?.url;
        expired(redirect_url);
        }
        return throwError(error);
    }));

    return next.handle(request);
  };
}

export const expired = (redirect_url: string) => {
  window.location.href = `/redirect/session-expired?redirect=${redirect_url}`;
}