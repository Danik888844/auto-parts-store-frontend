import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './core/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { GetToken } from './core/services/user.service';
import { provideTranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import localeKz from '@angular/common/locales/kk';
import localeEn from '@angular/common/locales/en';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SAVER, getSaver } from './core/services/download/saver.provider';

registerLocaleData(localeRu, 'ru');
registerLocaleData(localeEn, 'en');
registerLocaleData(localeKz, 'kz');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      BrowserAnimationsModule,
      MatSnackBarModule,
      JwtModule.forRoot({
        config: {
          tokenGetter: GetToken,
        },
      }),
    ),
    provideTranslateService({
      fallbackLang: 'ru',
      lang: 'ru',
      loader: provideTranslateHttpLoader({
        prefix: './assets/languages/',
        suffix: `.json?v=${environment.version}`,
      }),
    }),
    { provide: SAVER, useFactory: getSaver },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: LOCALE_ID,
      useFactory: () => localStorage.getItem('@lang') || 'en',
    },
  ],
};
