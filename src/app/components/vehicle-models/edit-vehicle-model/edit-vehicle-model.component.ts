import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleModelService } from '../../../core/services/vehicle-model.service';
import { VehicleBrandService } from '../../../core/services/vehicle-brand.service';
import { VehicleModelDto } from '../../../core/models/vehicle-model/vehicle-model-dto';
import { VehicleBrandDto } from '../../../core/models/vehicle-brand/vehicle-brand-dto';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../general-components/loading/loading.component';
import { CustomSelectComponent } from '../../general-components/custom-select/custom-select.component';

@Component({
  selector: 'app-edit-vehicle-model',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent,
    CustomSelectComponent,
  ],
  templateUrl: './edit-vehicle-model.component.html',
  styleUrl: './edit-vehicle-model.component.scss',
})
export class EditVehicleModelComponent implements OnInit, OnChanges {
  @Input() vehicleModel: VehicleModelDto | null = null;
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  submitting = false;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicleModel']?.currentValue) {
      const m = this.vehicleModel;
      this.form.patchValue({
        brandId: m?.brandId ?? m?.brand?.id ?? null,
        name: m?.name ?? '',
      });
      this.errorMessage = '';
    }
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
    if (!this.vehicleModel?.id || this.form.invalid || this.submitting) return;
    this.errorMessage = '';
    this.submitting = true;
    this.vehicleModelService.edit(String(this.vehicleModel.id), this.form.getRawValue()).subscribe({
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
