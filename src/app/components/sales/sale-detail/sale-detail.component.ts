import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { SaleService } from '../../../core/services/sale.service';
import { SaleDto } from '../../../core/models/sale/sale-dto';
import { SaleItemDto } from '../../../core/models/sale/sale-item-dto';
import { SaleStatus } from '../../../core/models/sale/sale-status';
import { PaymentType } from '../../../core/models/sale/payment-type';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingComponent } from '../../general-components/loading/loading.component';
import { RefundQuantityDialogComponent } from './refund-quantity-dialog/refund-quantity-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-sale-detail',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    TranslateModule,
    LoadingComponent,
  ],
  templateUrl: './sale-detail.component.html',
  styleUrl: './sale-detail.component.scss',
})
export class SaleDetailComponent implements OnInit {
  sale: SaleDto | null = null;
  loading = true;
  errorMessage = '';
  actionLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private saleService: SaleService,
    public translateService: TranslateService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.loadSale(id);
      }
    });
  }

  get saleId(): string {
    return this.sale?.id != null ? String(this.sale.id) : '';
  }

  loadSale(id: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.saleService.getBy(id).subscribe({
      next: (res) => {
        this.sale = res.data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Не удалось загрузить продажу';
        this.loading = false;
      },
    });
  }

  statusLabel(s: SaleStatus | undefined): string {
    if (s == null) return '';
    const key = SaleStatus[s] ?? '';
    return key ? this.translateService.instant(key) : String(s);
  }

  paymentTypeLabel(p: PaymentType | undefined): string {
    if (p == null) return '';
    const key = PaymentType[p] ?? '';
    return key ? this.translateService.instant(key) : String(p);
  }

  productName(item: SaleItemDto): string {
    const p = item?.product;
    if (!p) return '';
    const sku = (p as any).Sku ?? (p as any).sku ?? '';
    const name = (p as any).name ?? '';
    return sku ? `${sku} ${name}`.trim() : name;
  }

  canRefund(): boolean {
    return this.sale?.status === SaleStatus.Completed;
  }

  fullRefund(): void {
    if (!this.sale?.id || !this.canRefund()) return;
    if (!confirm(this.translateService.instant('ConfirmFullRefund'))) return;
    this.actionLoading = true;
    this.saleService.refund(String(this.sale.id)).subscribe({
      next: () => {
        this.actionLoading = false;
        this.loadSale(String(this.sale!.id));
      },
      error: () => {
        this.actionLoading = false;
      },
    });
  }

  openPartialRefund(item: SaleItemDto): void {
    if (!this.sale?.id || item?.id == null || !this.canRefund()) return;
    const maxQty = item.quantity ?? 0;
    const dialogRef = this.dialog.open(RefundQuantityDialogComponent, {
      width: '320px',
      data: { maxQuantity: maxQty, productName: this.productName(item) },
    });
    dialogRef.afterClosed().subscribe((quantity: number | undefined) => {
      if (quantity === undefined) return;
      this.actionLoading = true;
      const q = quantity <= 0 ? undefined : quantity;
      this.saleService
        .refundItem(String(this.sale!.id), String(item.id), q as number)
        .subscribe({
          next: () => {
            this.actionLoading = false;
            this.loadSale(String(this.sale!.id));
          },
          error: () => {
            this.actionLoading = false;
          },
        });
    });
  }

  back(): void {
    this.router.navigate(['/sales']);
  }
}
