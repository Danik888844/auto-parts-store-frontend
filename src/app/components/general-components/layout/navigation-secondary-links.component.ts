import { Component, OnInit, signal, effect } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { DialogContentComponent } from './dialog/dialog-content.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UserDto } from '../../../core/models/users/user-dto';
import { UserService } from '../../../core/services/user.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UiLanguageService } from '../../../core/services/helpers/ui-language.service';

const LANG_LABELS: Record<string, string> = { en: 'EN', ru: 'RU', kz: 'KZ' };

@Component({
  selector: 'app-navigation-secondary-links',
  template: `
    <button
      mat-icon-button
      [matMenuTriggerFor]="langMenu"
      class="lang-switcher"
      [title]="'Language' | translate"
      type="button"
    >
      <span class="lang-code">{{
        LANG_LABELS[currentLangCode()] || currentLangCode()
      }}</span>
    </button>
    <mat-menu #langMenu="matMenu" class="lang-menu-panel">
      @for (lang of languages; track lang) {
        <button
          mat-menu-item
          (click)="setLanguage(lang)"
          [class.active]="currentLangCode() === lang"
        >
          {{ LANG_LABELS[lang] }}
        </button>
      }
    </mat-menu>

    @if (currentUser()) {
      <div
        class="user-initials"
        [title]="currentUser()?.firstName + ' ' + currentUser()?.lastName"
      >
        {{ getInitials() }}
      </div>
      <button
        mat-icon-button
        (click)="openDialog()"
        title="{{ 'Logout' | translate }}"
      >
        <mat-icon>logout</mat-icon>
      </button>
    }
  `,
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatIcon,
    CommonModule,
    TranslateModule,
  ],
  standalone: true,
  styles: `
    .user-initials {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #1e88e5;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      flex-shrink: 0;
    }
    .lang-switcher {
      .lang-code {
        font-size: 12px;
        font-weight: 600;
        color: #333;
      }
      &:hover .lang-code {
        color: #1e88e5;
      }
    }
  `,
})
export class NavigationSecondaryLinksComponent implements OnInit {
  currentUser = signal<UserDto | null>(null);
  currentLangCode = signal<string>('en');
  protected readonly LANG_LABELS = LANG_LABELS;

  get languages(): string[] {
    return this.uiLang.getLanguages();
  }

  constructor(
    public dialog: MatDialog,
    public translateService: TranslateService,
    private uiLang: UiLanguageService,
  ) {
    this.currentLangCode.set(this.uiLang.getLangCode());
    effect(
      () => {
        const user = UserService.getUser().user;
        if (user) this.currentUser.set(user);
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    const user = UserService.getUser().user;
    if (user) this.currentUser.set(user);
    this.currentLangCode.set(this.uiLang.getLangCode());
  }

  setLanguage(lang: string): void {
    this.uiLang.setLang(lang);
    this.currentLangCode.set(this.uiLang.getLangCode());
  }

  getInitials(): string {
    const user = this.currentUser();
    if (!user) return '';
    const first = (user.firstName || '').trim().charAt(0).toUpperCase();
    const last = (user.lastName || '').trim().charAt(0).toUpperCase();
    if (first || last) return first + last || '?';
    if (user.userName) return user.userName.charAt(0).toUpperCase();
    return '?';
  }

  openDialog(): void {
    this.dialog.open(DialogContentComponent, {
      data: {
        title: 'Logout',
        content: this.translateService.instant('AreYouSureToExit'),
        btnText: 'Yes',
        isLogout: true,
      },
      width: '250px',
    });
  }
}
