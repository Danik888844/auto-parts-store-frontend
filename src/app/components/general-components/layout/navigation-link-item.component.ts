import { Component, Input } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { NavigationLinkModel } from '../../../core/helpers/consts/links';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation-link-item',
  template: `
    <li [id]="data.id">
      <a
        mat-ripple
        [routerLink]="data.link"
        routerLinkActive="active"
        [routerLinkActiveOptions]="{ exact: true }"
        [ngClass]="hasHighlight ? ['highlight'] : ''"
      >
        @if (data.icon) {
          <mat-icon>{{ data.icon }}</mat-icon>
        }
        <div class="text flex-grow-1">{{ data.title | translate }}</div>
      </a>
    </li>
  `,
  imports: [
    MatRipple,
    NgClass,
    RouterLink,
    RouterLinkActive,
    MatIcon,
    TranslateModule,
  ],
  standalone: true,
})
export class NavigationLinkItemComponent {
  @Input() data!: NavigationLinkModel;
  @Input() hasHighlight: boolean = false;
}
