import { Component } from '@angular/core';
import { NavigationLinkItemComponent } from './navigation-link-item.component';
import { CommonModule } from '@angular/common';
import { navigationLinks } from '../../../core/helpers/consts/links';

@Component({
  selector: 'app-navigation-links',
  template: `
    @for (link of visibleLinks(); track $index) {
      <app-navigation-link-item
        [data]="link"
        [hasHighlight]="hasHighlight"
      ></app-navigation-link-item>
    }
  `,
  imports: [NavigationLinkItemComponent, CommonModule],
  standalone: true,
})
export class NavigationLinksComponent {
  navigationLinks = navigationLinks;
  hasHighlight = false;

  constructor() {}
}
