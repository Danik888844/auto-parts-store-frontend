import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../../../core/services/vehicle.service';
import { VehicleModelService } from '../../../core/services/vehicle-model.service';
import { VehicleModelDto } from '../../../core/models/vehicle-model/vehicle-model-dto';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../general-components/loading/loading.component';
import { CustomSelectComponent } from '../../general-components/custom-select/custom-select.component';

@Component({
  selector: 'app-new-vehicle',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent,
    CustomSelectComponent,
  ],
  templateUrl: './new-vehicle.component.html',
  styleUrl: './new-vehicle.component.scss',
})
export class NewVehicleComponent implements OnInit {
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  isLoading = false;
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
    if (this.form.invalid || this.isLoading) return;
    this.errorMessage = '';
    this.isLoading = true;
    const v = this.form.getRawValue();
    const payload = {
      modelId: v.modelId,
      yearFrom: v.yearFrom ?? 0,
      yearTo: v.yearTo ?? 0,
      generation: v.generation || null,
      engine: v.engine || null,
      bodyType: v.bodyType || null,
      note: v.note || null,
    };
    this.vehicleService.create(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.form.reset({
          modelId: null,
          yearFrom: null,
          yearTo: null,
          generation: null,
          engine: null,
          bodyType: null,
          note: null,
        });
        this.saveData.emit();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
