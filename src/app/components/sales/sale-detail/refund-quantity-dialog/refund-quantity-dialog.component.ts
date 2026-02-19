import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

export interface RefundQuantityDialogData {
  maxQuantity: number;
  productName?: string;
}

@Component({
  selector: 'app-refund-quantity-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
  ],
  templateUrl: './refund-quantity-dialog.component.html',
  styleUrl: './refund-quantity-dialog.component.scss',
})
export class RefundQuantityDialogComponent {
  quantity = 0;

  constructor(
    public dialogRef: MatDialogRef<RefundQuantityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RefundQuantityDialogData,
  ) {
    this.quantity = data.maxQuantity ?? 0;
  }

  onConfirm(): void {
    this.dialogRef.close(this.quantity);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
