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

@Component({
  selector: 'app-navigation-secondary-links',
  template: `
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
  `,
})
export class NavigationSecondaryLinksComponent implements OnInit {
  currentUser = signal<UserDto | null>(null);

  constructor(
    public dialog: MatDialog,
    private translateService: TranslateService,
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
        content: 'AreYouSureToExit',
        btnText: 'Yes',
      },
      width: '250px',
    });
  }
}
