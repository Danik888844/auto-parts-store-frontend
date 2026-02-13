import {Component, OnInit} from '@angular/core';
import { RouterOutlet} from "@angular/router";
import {NavigationLinksComponent} from "./navigation-links.component";
import {NavigationSecondaryLinksComponent} from "./navigation-secondary-links.component";
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationLinksComponent,
    NavigationSecondaryLinksComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Загружаем пользователя при инициализации, если есть токен
    if (this.authService.getToken() && !this.authService.currentUser()) {
      this.authService.getMe().subscribe({
        next: (response) => {
          this.authService.setUser(response.user);
        },
        error: () => {
          // Если токен невалидный, удаляем его
          this.authService.removeToken();
        },
      });
    }
  }
}
