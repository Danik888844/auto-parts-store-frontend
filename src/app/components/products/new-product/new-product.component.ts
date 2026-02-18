import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
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
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../general-components/loading/loading.component';
import { CustomSelectComponent } from '../../general-components/custom-select/custom-select.component';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  map,
  switchMap,
  catchError,
  first,
} from 'rxjs/operators';
import { CategoryDto } from '../../../core/models/category/category-dto';
import { ManufacturerDto } from '../../../core/models/manufacturer/manufacturer-dto';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent,
    CustomSelectComponent,
  ],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss',
})
export class NewProductComponent implements OnInit {
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private manufacturerService = inject(ManufacturerService);

  form: FormGroup;
  isLoading = false;
  errorMessage = '';
  categories: CategoryDto[] = [];
  manufacturers: ManufacturerDto[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      sku: [
        '',
        [Validators.required, Validators.maxLength(100)],
        [this.skuExistsValidator.bind(this)],
      ],
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
    this.loadCategories();
    this.loadManufacturers();
  }

  private loadCategories(): void {
    this.categoryService
      .getList({ viewSize: 500, pageNumber: 1, search: '' })
      .subscribe((res) => {
        this.categories = res.data?.items ?? [];
      });
  }

  private loadManufacturers(): void {
    this.manufacturerService
      .getList({ viewSize: 500, pageNumber: 1, search: '' })
      .subscribe((res) => {
        this.manufacturers = res.data?.items ?? [];
      });
  }

  private skuExistsValidator(
    control: AbstractControl,
  ): Observable<ValidationErrors | null> {
    const sku = control.value;
    if (sku == null || String(sku).trim() === '') {
      return of(null);
    }
    return of(sku).pipe(
      debounceTime(500),
      switchMap((s) =>
        this.productService.checkSkuExists(String(s).trim()),
      ),
      map((r) =>
        r?.data?.exists ? { skuExists: true } : null,
      ),
      catchError(() => of(null)),
      first(),
    );
  }

  onCancel(): void {
    this.cancel.emit();
  }

  submit(): void {
    if (this.form.invalid || this.isLoading) return;

    this.errorMessage = '';
    this.isLoading = true;
    const value = this.form.getRawValue();
    const payload = {
      sku: value.sku?.trim(),
      name: value.name,
      categoryId: value.categoryId || null,
      manufacturerId: value.manufacturerId || null,
      purchasePrice: value.purchasePrice,
      price: value.price,
      description: value.description || null,
      isActive: value.isActive,
    };
    this.productService.create(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.saveData.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || '';
      },
    });
  }
}
