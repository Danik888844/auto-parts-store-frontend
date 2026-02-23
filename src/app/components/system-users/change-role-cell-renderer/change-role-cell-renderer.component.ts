import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { UserDto } from '../../../core/models/users/user-dto';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

export interface ChangeRoleContext {
  openChangeRole: (user: UserDto) => void;
}

@Component({
  selector: 'app-change-role-cell',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, TranslateModule],
  template: `
    <button
      mat-icon-button
      color="primary"
      (click)="onClick()"
      [matTooltip]="'ChangeRole' | translate"
    >
      <mat-icon>admin_panel_settings</mat-icon>
    </button>
  `,
})
export class ChangeRoleCellRendererComponent implements ICellRendererAngularComp {
  private params!: ICellRendererParams<UserDto, unknown, ChangeRoleContext>;

  agInit(params: ICellRendererParams<UserDto, unknown, ChangeRoleContext>): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onClick(): void {
    const ctx = this.params.context as ChangeRoleContext;
    if (ctx?.openChangeRole && this.params.data) {
      ctx.openChangeRole(this.params.data);
    }
  }
}
