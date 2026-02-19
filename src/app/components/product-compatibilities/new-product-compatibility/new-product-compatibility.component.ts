import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductCompatibilityService } from '../../../core/services/product-compatibility.service';
import { ProductService } from '../../../core/services/product.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../general-components/loading/loading.component';
import { CustomSelectComponent } from '../../general-components/custom-select/custom-select.component';

@Component({
  selector: 'app-new-product-compatibility',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent,
    CustomSelectComponent,
  ],
  templateUrl: './new-product-compatibility.component.html',
  styleUrl: './new-product-compatibility.component.scss',
})
export class NewProductCompatibilityComponent implements OnInit {
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  isLoading = false;
  errorMessage = '';
  productOptions: { id: string; name: string }[] = [];
  vehicleOptions: { id: string; name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private productCompatibilityService: ProductCompatibilityService,
    private productService: ProductService,
    private vehicleService: VehicleService,
  ) {
    this.form = this.fb.group({
      productId: [null as string | null, Validators.required],
      vehicleId: [null as string | null, Validators.required],
      comment: [null as string | null, [Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    this.loadProducts('');
    this.loadVehicles('');
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

  loadVehicles(searchTerm: string): void {
    this.vehicleService
      .getList({ viewSize: 20, pageNumber: 1, search: searchTerm ?? '' })
      .subscribe((res) => {
        const items = res.data?.items ?? [];
        this.vehicleOptions = items.map((v: any) => ({
          id: v.id,
          name: this.getVehicleDisplayName(v),
        }));
      });
  }

  private getVehicleDisplayName(v: any): string {
    const m = v?.model;
    const modelName = m ? (m.brand ? `${m.brand.name} ${m.name}` : m.name) : '';
    const yFrom = v?.yearFrom ?? '';
    const yTo = v?.yearTo ?? '';
    const s = `${modelName}${yFrom || yTo ? ` (${yFrom}-${yTo})` : ''}`.trim();
    return s || (v?.id ?? '');
  }

  onCancel(): void {
    this.cancel.emit();
  }

  submit(): void {
    if (this.form.invalid || this.isLoading) return;
    this.errorMessage = '';
    this.isLoading = true;
    const v = this.form.getRawValue();
    const payload = {
      productId: v.productId,
      vehicleId: v.vehicleId,
      comment: v.comment?.trim() || null,
    };
    this.productCompatibilityService.create(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.form.reset({ productId: null, vehicleId: null, comment: null });
        this.saveData.emit();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
