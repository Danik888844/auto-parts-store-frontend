import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleModelService } from '../../../core/services/vehicle-model.service';
import { VehicleBrandService } from '../../../core/services/vehicle-brand.service';
import { VehicleBrandDto } from '../../../core/models/vehicle-brand/vehicle-brand-dto';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../general-components/loading/loading.component';
import { CustomSelectComponent } from '../../general-components/custom-select/custom-select.component';

@Component({
  selector: 'app-new-vehicle-model',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent,
    CustomSelectComponent,
  ],
  templateUrl: './new-vehicle-model.component.html',
  styleUrl: './new-vehicle-model.component.scss',
})
export class NewVehicleModelComponent implements OnInit {
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  isLoading = false;
  errorMessage = '';
  brands: VehicleBrandDto[] = [];

  constructor(
    private fb: FormBuilder,
    private vehicleModelService: VehicleModelService,
    private vehicleBrandService: VehicleBrandService,
  ) {
    this.form = this.fb.group({
      brandId: [null as string | null, Validators.required],
      name: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  ngOnInit(): void {
    this.loadBrands('');
  }

  loadBrands(searchTerm: string): void {
    this.vehicleBrandService
      .getList({ viewSize: 20, pageNumber: 1, search: searchTerm ?? '' })
      .subscribe((res) => {
        this.brands = res.data?.items ?? [];
      });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  submit(): void {
    if (this.form.invalid || this.isLoading) return;
    this.errorMessage = '';
    this.isLoading = true;
    const value = this.form.getRawValue();
    this.vehicleModelService
      .create({ brandId: value.brandId, name: value.name })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.form.reset({ brandId: null, name: '' });
          this.saveData.emit();
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
}
