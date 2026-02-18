import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../../../core/services/vehicle.service';
import { VehicleModelService } from '../../../core/services/vehicle-model.service';
import { VehicleDto } from '../../../core/models/vehicle/vehicle-dto';
import { VehicleModelDto } from '../../../core/models/vehicle-model/vehicle-model-dto';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../general-components/loading/loading.component';
import { CustomSelectComponent } from '../../general-components/custom-select/custom-select.component';

@Component({
  selector: 'app-edit-vehicle',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent,
    CustomSelectComponent,
  ],
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.scss',
})
export class EditVehicleComponent implements OnInit, OnChanges {
  @Input() vehicle: VehicleDto | null = null;
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  submitting = false;
  errorMessage = '';
  models: VehicleModelDto[] = [];

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private vehicleModelService: VehicleModelService,
  ) {
    this.form = this.fb.group({
      modelId: [null as string | null, Validators.required],
      yearFrom: [null as number | null, [Validators.required, Validators.min(1900), Validators.max(2100)]],
      yearTo: [null as number | null, [Validators.required, Validators.min(1900), Validators.max(2100)]],
      generation: [null as string | null, [Validators.maxLength(200)]],
      engine: [null as string | null, [Validators.maxLength(200)]],
      bodyType: [null as string | null, [Validators.maxLength(100)]],
      note: [null as string | null, [Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    this.loadModels('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicle']?.currentValue) {
      const v = this.vehicle;
      this.form.patchValue({
        modelId: v?.modelId ?? v?.model?.id ?? null,
        yearFrom: v?.yearFrom ?? null,
        yearTo: v?.yearTo ?? null,
        generation: v?.generation ?? null,
        engine: v?.engine ?? null,
        bodyType: v?.bodyType ?? null,
        note: v?.note ?? null,
      });
      this.errorMessage = '';
    }
  }

  loadModels(searchTerm: string): void {
    this.vehicleModelService
      .getList({ viewSize: 20, pageNumber: 1, search: searchTerm ?? '' })
      .subscribe((res) => {
        this.models = res.data?.items ?? [];
      });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  submit(): void {
    if (!this.vehicle?.id || this.form.invalid || this.submitting) return;
    this.errorMessage = '';
    this.submitting = true;
    const raw = this.form.getRawValue();
    const payload = {
      modelId: raw.modelId,
      yearFrom: raw.yearFrom ?? 0,
      yearTo: raw.yearTo ?? 0,
      generation: raw.generation || null,
      engine: raw.engine || null,
      bodyType: raw.bodyType || null,
      note: raw.note || null,
    };
    this.vehicleService.edit(String(this.vehicle.id), payload).subscribe({
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
