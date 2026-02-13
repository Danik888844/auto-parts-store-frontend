import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UiLanguageService {
  data: any;
  setLangSubject = new Subject<string>();
  validLangs: string[] = ['en', 'ru', 'kz'];

  constructor(private tr: TranslateService, private http: HttpClient) {
    let lang = this.getLangCode();
    this.setLang(lang);
  }

  getLanguages = () => {
    return this.validLangs;
  }

  getLangCode = () => {
    let lang = localStorage.getItem('@lang');
    return lang && this.validLangs.includes(lang) ? lang : 'en';
  }

  setLang = (lang: string | undefined) => {
    lang = (lang && this.validLangs.includes(lang)) ? lang : this.getLangCode();
    this.tr.use(lang!);
    localStorage.setItem('@lang', lang!);
  }

}