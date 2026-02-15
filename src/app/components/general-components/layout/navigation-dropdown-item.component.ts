import { Component, Input, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import type { NavigationDropdownModel } from '../../../core/helpers/consts/links';
import { catalogRoutePaths } from '../../../core/helpers/consts/links';

@Component({
  selector: 'app-navigation-dropdown-item',
  template: `
    <li [id]="data.id">
      <button
        mat-button
        [matMenuTriggerFor]="menu"
        [ngClass]="{ highlight: hasHighlight, active: isCatalogActive() }"
        class="nav-dropdown-trigger"
      >
        @if (data.icon) {
          <mat-icon class="trigger-icon">{{ data.icon }}</mat-icon>
        }
        <span class="text trigger-label flex-grow-1">{{ data.title | translate }}</span>
        <mat-icon class="dropdown-arrow">expand_more</mat-icon>
      </button>
      <mat-menu #menu="matMenu" class="nav-catalog-panel">
        @for (section of data.sections; track section.sectionTitle) {
          <div class="nav-dropdown-section">
            <div class="nav-dropdown-section-title">{{ section.sectionTitle | translate }}</div>
            @for (item of section.items; track item.link) {
              <a
                mat-menu-item
                [routerLink]="item.link"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                {{ item.title | translate }}
              </a>
            }
          </div>
        }
      </mat-menu>
    </li>
  `,
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatIcon,
    RouterLink,
    RouterLinkActive,
    NgClass,
    TranslateModule,
  ],
  standalone: true,
  styles: [
    `
      .nav-dropdown-trigger {
        display: flex;
        align-items: center;
        width: 100%;
        text-align: left;
        gap: 6px;
      }
      .trigger-icon {
        order: 1;
        flex-shrink: 0;
      }
      .trigger-label {
        order: 2;
        flex-grow: 1;
      }
      .dropdown-arrow {
        order: 3;
        flex-shrink: 0;
        margin-left: 4px;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    `,
  ],
})
export class NavigationDropdownItemComponent {
  @Input() data!: NavigationDropdownModel & { type: 'dropdown' };
  @Input() hasHighlight = false;

  private router = inject(Router);

  isCatalogActive(): boolean {
    const url = this.router.url.split('?')[0];
    return catalogRoutePaths.some((path) => url === path || url.startsWith(path + '/'));
  }
}
