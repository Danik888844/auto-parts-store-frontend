import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { ManufacturerService } from '../../../core/services/manufacturer.service';
import { ProductDto } from '../../../core/models/product/product-dto';
import { CategoryDto } from '../../../core/models/category/category-dto';
import { ManufacturerDto } from '../../../core/models/manufacturer/manufacturer-dto';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../general-components/loading/loading.component';
import { CustomSelectComponent } from '../../general-components/custom-select/custom-select.component';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent,
    CustomSelectComponent,
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
})
export class EditProductComponent implements OnInit, OnChanges {
  @Input() product: ProductDto | null = null;
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private manufacturerService = inject(ManufacturerService);

  form: FormGroup;
  submitting = false;
  errorMessage = '';
  categories: CategoryDto[] = [];
  manufacturers: ManufacturerDto[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      sku: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      categoryId: [null as string | null],
      manufacturerId: [null as string | null],
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: [null as string | null, [Validators.maxLength(2000)]],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.loadCategories('');
    this.loadManufacturers('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']?.currentValue) {
      const p = this.product;
      const sku = p?.Sku ?? (p as any)?.sku ?? '';
      this.form.patchValue({
        sku,
        name: p?.name ?? '',
        categoryId: p?.categoryId ?? p?.category?.id ?? null,
        manufacturerId: p?.manufacturerId ?? p?.manufacturer?.id ?? null,
        purchasePrice: p?.purchasePrice ?? 0,
        price: p?.price ?? 0,
        description: p?.description ?? null,
        isActive: p?.isActive ?? true,
      });
      this.errorMessage = '';
    }
  }

  loadCategories(searchTerm: string): void {
    this.categoryService
      .getList({ viewSize: 20, pageNumber: 1, search: searchTerm ?? '' })
      .subscribe((res) => {
        this.categories = res.data?.items ?? [];
      });
  }

  loadManufacturers(searchTerm: string): void {
    this.manufacturerService
      .getList({ viewSize: 20, pageNumber: 1, search: searchTerm ?? '' })
      .subscribe((res) => {
        this.manufacturers = res.data?.items ?? [];
      });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  submit(): void {
    if (!this.product?.id || this.form.invalid || this.submitting) return;
    this.errorMessage = '';
    this.submitting = true;
    const raw = this.form.getRawValue();
    const payload: Record<string, unknown> = { ...raw };
    delete payload['sku'];
    this.productService.edit(String(this.product.id), payload).subscribe({
      next: () => {
        this.submitting = false;
        this.saveData.emit();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.error?.message || '';
      },
    });
  }
}
