import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { decodeHtml } from '../../helpers/decode-html';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private snackBar: MatSnackBar,
    public translateService: TranslateService,
  ) {}

  success(message?: any): void {
    this.snackBar.open(
      this.translateService.instant(decodeHtml(message) || 'Successfully'),
      this.translateService.instant('Close'),
      { duration: 3000, panelClass: ['success-notification'] },
    );
  }

  warning(message: any): void {
    this.snackBar.open(
      this.translateService.instant(message || 'Warning'),
      this.translateService.instant('Close'),
      { duration: 4000, panelClass: ['warning-notification'] },
    );
  }

  error(message: any = ''): void {
    this.snackBar.open(
      this.translateService.instant(message || 'Error'),
      this.translateService.instant('Close'),
      { duration: 5000, panelClass: ['error-notification'] },
    );
  }
}