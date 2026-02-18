import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleBrandService } from '../../../core/services/vehicle-brand.service';
import { VehicleBrandDto } from '../../../core/models/vehicle-brand/vehicle-brand-dto';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-vehicle-brand',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './edit-vehicle-brand.component.html',
  styleUrl: './edit-vehicle-brand.component.scss',
})
export class EditVehicleBrandComponent implements OnChanges {
  @Input() vehicleBrand: VehicleBrandDto | null = null;
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private vehicleBrandService: VehicleBrandService,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicleBrand']?.currentValue) {
      this.form.patchValue({ name: this.vehicleBrand?.name ?? '' });
      this.errorMessage = '';
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  submit(): void {
    if (!this.vehicleBrand?.id || this.form.invalid || this.submitting) return;
    this.errorMessage = '';
    this.submitting = true;
    this.vehicleBrandService.edit(String(this.vehicleBrand.id), this.form.getRawValue()).subscribe({
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
