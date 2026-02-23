import { Component, inject } from '@angular/core';
import { NavigationLinkItemComponent } from './navigation-link-item.component';
import { NavigationDropdownItemComponent } from './navigation-dropdown-item.component';
import { CommonModule } from '@angular/common';
import {
  getNavigationItems,
  NavigationItem,
  NavigationDropdownModel,
} from '../../../core/helpers/consts/links';
import { UserService } from '../../../core/services/user.service';

function isDropdown(
  item: NavigationItem
): item is NavigationDropdownModel & { type: 'dropdown' } {
  return 'type' in item && (item as { type?: string }).type === 'dropdown';
}

@Component({
  selector: 'app-navigation-links',
  template: `
    @for (item of navigationItems; track item.id || item.title) {
      @if (isDropdown(item)) {
        <app-navigation-dropdown-item
          [data]="item"
          [hasHighlight]="hasHighlight"
        ></app-navigation-dropdown-item>
      } @else {
        <app-navigation-link-item
          [data]="item"
          [hasHighlight]="hasHighlight"
        ></app-navigation-link-item>
      }
    }
  `,
  imports: [
    NavigationLinkItemComponent,
    NavigationDropdownItemComponent,
    CommonModule,
  ],
  standalone: true,
})
export class NavigationLinksComponent {
  private userService = inject(UserService);

  get navigationItems(): NavigationItem[] {
    return getNavigationItems(this.userService.isAdmin());
  }

  hasHighlight = false;
  isDropdown = isDropdown;
}
