import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ManufacturerService } from '../../../core/services/manufacturer.service';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../general-components/loading/loading.component';

@Component({
  selector: 'app-new-manufacturer',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent,
  ],
  templateUrl: './new-manufacturer.component.html',
  styleUrl: './new-manufacturer.component.scss',
})
export class NewManufacturerComponent {
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private manufacturerService: ManufacturerService,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      country: ['', [Validators.maxLength(200)]],
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
    const payload = { ...value, country: value.country?.trim() || null };
    this.manufacturerService.create(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.form.reset({ name: '', country: '' });
        this.saveData.emit();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
