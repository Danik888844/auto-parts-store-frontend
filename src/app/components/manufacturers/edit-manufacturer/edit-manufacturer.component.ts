import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ManufacturerService } from '../../../core/services/manufacturer.service';
import { ManufacturerDto } from '../../../core/models/manufacturer/manufacturer-dto';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-manufacturer',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './edit-manufacturer.component.html',
  styleUrl: './edit-manufacturer.component.scss',
})
export class EditManufacturerComponent implements OnChanges {
  @Input() manufacturer: ManufacturerDto | null = null;
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  submitting = false;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['manufacturer']?.currentValue) {
      this.form.patchValue({
        name: this.manufacturer?.name ?? '',
        country: this.manufacturer?.country ?? '',
      });
      this.errorMessage = '';
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  submit(): void {
    if (!this.manufacturer?.id || this.form.invalid || this.submitting) return;
    this.errorMessage = '';
    this.submitting = true;
    const value = this.form.getRawValue();
    const payload = { ...value, country: value.country?.trim() || null };
    this.manufacturerService.edit(String(this.manufacturer.id), payload).subscribe({
      next: () => {
        this.submitting = false;
        this.saveData.emit();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.error?.message || 'Ошибка при сохранении';
      },
    });
  }
}
