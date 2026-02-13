import { Component, OnInit, signal, effect } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { DialogContentComponent } from './dialog/dialog-content.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserDto } from '../../../core/models/users/user-dto';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-navigation-secondary-links',
  template: `
    @if (currentUser()) {
      <div class="user-info">
        <div class="user-name">
          {{ currentUser()?.firstName + ' ' + currentUser()?.lastName }}
        </div>
      </div>
      <button mat-icon-button (click)="openDialog()" title="Выйти">
        <mat-icon>logout</mat-icon>
      </button>
    } @else {
      <button mat-button class="login-button" [routerLink]="['/login']">
        Войти
      </button>
    }
  `,
  imports: [MatMenuModule, MatButtonModule, MatIcon, CommonModule, RouterLink],
  standalone: true,
  styles: `
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-right: 8px;

      .user-name {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }

      .role-badge {
        font-size: 12px;
        padding: 4px 10px;
        background-color: #e0e0e0;
        border-radius: 12px;
        color: #555;
        font-weight: 500;
      }
    }

    .login-button {
      color: #333;
      font-weight: 500;
    }
  `,
})
export class NavigationSecondaryLinksComponent implements OnInit {
  currentUser = signal<UserDto | null>(null);

  constructor(
    public dialog: MatDialog,
    private router: Router,
  ) {
    // Отслеживаем изменения пользователя через effect
    effect(() => {
      const user = UserService.getUser().user;
      if (user) this.currentUser.set(user);
    });
  }

  ngOnInit(): void {
    const user = UserService.getUser().user;
    if (user) this.currentUser.set(user);
  }

  openDialog(): void {
    this.dialog.open(DialogContentComponent, {
      data: {
        title: 'Выход',
        content: 'Вы уверены, что хотите выйти?',
        btnText: 'Да',
        isLogout: true,
      },
      width: '250px',
    });
  }
}
