import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { SaleService } from '../../../core/services/sale.service';
import { ClientService } from '../../../core/services/client.service';
import { ProductService } from '../../../core/services/product.service';
import { PaymentType } from '../../../core/models/sale/payment-type';
import { SaleFormDto } from '../../../core/models/sale/sale-dto';
import { SaleItemFormDto } from '../../../core/models/sale/sale-item-dto';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../general-components/loading/loading.component';
import { CustomSelectComponent } from '../../general-components/custom-select/custom-select.component';

@Component({
  selector: 'app-new-sale',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent,
    CustomSelectComponent,
  ],
  templateUrl: './new-sale.component.html',
  styleUrl: './new-sale.component.scss',
})
export class NewSaleComponent implements OnInit {
  @Output() saved = new EventEmitter<void>();

  form: FormGroup;
  isLoading = false;
  errorMessage = '';
  clients: { id: string; name: string }[] = [];
  productOptions: { id: string; name: string }[] = [];
  paymentTypes = [
    { value: PaymentType.Cash, labelKey: 'Cash' },
    { value: PaymentType.Card, labelKey: 'Card' },
    { value: PaymentType.Transfer, labelKey: 'Transfer' },
  ];

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private clientService: ClientService,
    private productService: ProductService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      clientId: [null as string | null],
      paymentType: [PaymentType.Cash, Validators.required],
      items: this.fb.array([this.createItemGroup()]),
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  private createItemGroup(): FormGroup {
    return this.fb.group({
      productId: [null as string | null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.loadClients('');
    this.loadProducts('');
  }

  loadClients(searchTerm: string): void {
    this.clientService
      .getList({ viewSize: 20, pageNumber: 1, search: searchTerm ?? '' })
      .subscribe((res) => {
        const items = res.data?.items ?? [];
        this.clients = items.map((c: any) => ({
          id: c.id,
          name: c.fullName ?? c.name ?? String(c.id),
        }));
      });
  }

  loadProducts(searchTerm: string): void {
    this.productService
      .getList({ viewSize: 20, pageNumber: 1, search: searchTerm ?? '' })
      .subscribe((res) => {
        const items = res.data?.items ?? [];
        this.productOptions = items.map((p: any) => {
          const sku = p.Sku ?? p.sku ?? '';
          const name = p.name ?? '';
          return { id: p.id, name: sku ? `${sku}${name ? ' - ' + name : ''}` : name };
        });
      });
  }

  addRow(): void {
    this.items.push(this.createItemGroup());
  }

  removeRow(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  onCancel(): void {
    this.router.navigate(['/sales']);
  }

  submit(): void {
    if (this.form.invalid || this.isLoading) return;
    this.errorMessage = '';
    this.isLoading = true;
    const v = this.form.getRawValue();
    const body: SaleFormDto = {
      clientId: v.clientId != null ? Number(v.clientId) : null,
      paymentType: Number(v.paymentType) as PaymentType,
      items: this.items.controls.map((ctrl) => {
        const row = ctrl.getRawValue();
        return {
          productId: Number(row.productId),
          quantity: Number(row.quantity),
        } as SaleItemFormDto;
      }).filter((item) => item.productId && item.quantity > 0),
    };
    if (body.items.length === 0) {
      this.errorMessage = 'Добавьте хотя бы одну позицию';
      this.isLoading = false;
      return;
    }
    this.saleService.create(body).subscribe({
      next: (res) => {
        this.isLoading = false;
        const id = res.data?.id;
        if (id != null) {
          this.router.navigate(['/sales', String(id)]);
        } else {
          this.saved.emit();
          this.router.navigate(['/sales']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message ?? '';
      },
    });
  }
}
