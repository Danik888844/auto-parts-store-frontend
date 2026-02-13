import { Component, Input } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { NavigationLinkModel } from '../../../core/helpers/consts/links';

@Component({
  selector: 'app-navigation-link-item',
  template: `
    <li [id]="data.id">
      <a
        mat-ripple
        [routerLink]="data.link"
        routerLinkActive="active"
        [ngClass]="hasHighlight ? ['highlight'] : ''"
      >
        @if(data.icon) {
          <mat-icon>{{ data.icon }}</mat-icon>
        }
        <div class="text flex-grow-1">{{ data.title }}</div>
      </a>
    </li>
  `,
  imports: [
    MatRipple,
    NgClass,
    RouterLink,
    RouterLinkActive,
    MatIcon
],
  standalone: true,
})
export class NavigationLinkItemComponent {
  @Input() data!: NavigationLinkModel;
  @Input() hasHighlight: boolean = false;
}
