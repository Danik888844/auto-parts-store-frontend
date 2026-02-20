import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StockMovementService, CreateStockMovementDto } from '../../../core/services/stock-movement.service';
import { ProductService } from '../../../core/services/product.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { StockMovementType } from '../../../core/models/stock-movement/stock-movement-type';
import { CustomSelectComponent } from '../../general-components/custom-select/custom-select.component';
import { LoadingComponent } from '../../general-components/loading/loading.component';

@Component({
  selector: 'app-new-stock-movement',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    CustomSelectComponent,
    LoadingComponent,
  ],
  templateUrl: './new-stock-movement.component.html',
  styleUrl: './new-stock-movement.component.scss',
})
export class NewStockMovementComponent implements OnInit {
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  isLoading = false;
  errorMessage = '';

  productOptions: { id: string; name: string }[] = [];
  supplierOptions: { id: string; name: string }[] = [];

  movementTypes = [
    { value: StockMovementType.In, labelKey: 'StockMovementType_In' },
    { value: StockMovementType.Out, labelKey: 'StockMovementType_Out' },
    { value: StockMovementType.Adjust, labelKey: 'StockMovementType_Adjust' },
  ];

  constructor(
    private fb: FormBuilder,
    private stockMovementService: StockMovementService,
    private productService: ProductService,
    private supplierService: SupplierService,
    public translate: TranslateService,
  ) {
    this.form = this.fb.group({
      productId: [null as string | null, Validators.required],
      type: [StockMovementType.In, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      reason: [null as string | null],
      documentNo: [null as string | null],
      supplierId: [null as string | null],
    });
  }

  ngOnInit(): void {
    this.loadProducts('');
    this.loadSuppliers('');
  }

  loadProducts(searchTerm: string): void {
    this.productService
      .getList({ viewSize: 20, pageNumber: 1, search: searchTerm ?? '' })
      .subscribe((res) => {
        const items = res.data?.items ?? [];
        this.productOptions = items.map((p: any) => {
          const sku = p.Sku ?? p.sku ?? '';
          const name = p.name ?? '';
          return {
            id: String(p.id),
            name: sku ? `${sku}${name ? ' — ' + name : ''}` : name,
          };
        });
      });
  }

  loadSuppliers(searchTerm: string): void {
    this.supplierService
      .getList({ viewSize: 20, pageNumber: 1, search: searchTerm ?? '' })
      .subscribe((res) => {
        const items = res.data?.items ?? [];
        this.supplierOptions = items.map((s: any) => ({
          id: String(s.id),
          name: s.name ?? String(s.id),
        }));
      });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isLoading) return;
    this.errorMessage = '';
    this.isLoading = true;
    const v = this.form.getRawValue();
    const body: CreateStockMovementDto = {
      productId: Number(v.productId),
      type: v.type as StockMovementType,
      quantity: Number(v.quantity),
      reason: v.reason && String(v.reason).trim() ? String(v.reason).trim() : null,
      documentNo: v.documentNo && String(v.documentNo).trim() ? String(v.documentNo).trim() : null,
      supplierId: v.supplierId != null && v.supplierId !== '' ? Number(v.supplierId) : null,
    };
    this.stockMovementService.create(body).subscribe({
      next: () => {
        this.isLoading = false;
        this.saved.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message ?? this.translate.instant('ErrorCreatingMovement');
      },
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
