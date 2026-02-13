import {Component, OnInit, computed, effect} from '@angular/core';
import { navigationLinks } from '../../../core/consts/links';
import { NavigationLinkItemComponent } from './navigation-link-item.component';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/user-dto';
import { CommonModule } from '@angular/common';

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
export class NavigationLinksComponent implements OnInit {
  navigationLinks = navigationLinks;
  hasHighlight = false;

  visibleLinks = computed(() => {
    const user = this.authService.currentUser();
    if (!user) {
      // Если пользователь не авторизован, показываем только главную
      return this.navigationLinks.filter(link => !link.roles || link.roles.length === 0);
    }

    return this.navigationLinks.filter(link => {
      // Если у ссылки нет ограничений по ролям, показываем всем
      if (!link.roles || link.roles.length === 0) {
        return true;
      }
      // Показываем только если роль пользователя в списке разрешенных
      return link.roles.includes(user.role);
    });
  });

  constructor(
    private authService: AuthService,
    // private requestsService: RequestsService
  ) {
    // Отслеживаем изменения пользователя
    effect(() => {
      const user = this.authService.currentUser();
      if (user && [Role.ADMIN, Role.TECH].includes(user.role)) {
        this.checkHighlight(user.id);
      }
    });
  }

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user && [Role.ADMIN, Role.TECH].includes(user.role)) {
      this.checkHighlight(user.id);
    }
  }

  // TODO: Implement highlight logic
  checkHighlight(userId: number): void {
    // this.requestsService.getRequests(userId).subscribe((requests) => {
    //   this.hasHighlight = requests.length > 0;
    // });
  }

}
