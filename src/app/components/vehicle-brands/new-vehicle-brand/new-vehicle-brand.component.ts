import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleBrandService } from '../../../core/services/vehicle-brand.service';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../general-components/loading/loading.component';

@Component({
  selector: 'app-new-vehicle-brand',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, ReactiveFormsModule, TranslateModule, LoadingComponent],
  templateUrl: './new-vehicle-brand.component.html',
  styleUrl: './new-vehicle-brand.component.scss',
})
export class NewVehicleBrandComponent {
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private vehicleBrandService: VehicleBrandService,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  submit(): void {
    if (this.form.invalid || this.isLoading) return;
    this.errorMessage = '';
    this.isLoading = true;
    this.vehicleBrandService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.isLoading = false;
        this.form.reset({ name: '' });
        this.saveData.emit();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
