import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SupplierService } from '../../../core/services/supplier.service';
import { SupplierDto } from '../../../core/models/supplier/supplier-dto';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-supplier',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './edit-supplier.component.html',
  styleUrl: './edit-supplier.component.scss',
})
export class EditSupplierComponent implements OnChanges {
  @Input() supplier: SupplierDto | null = null;
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      phone: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.maxLength(200), Validators.email]],
      address: ['', [Validators.maxLength(500)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['supplier']?.currentValue) {
      this.form.patchValue({
        name: this.supplier?.name ?? '',
        phone: this.supplier?.phone ?? '',
        email: this.supplier?.email ?? '',
        address: this.supplier?.address ?? '',
      });
      this.errorMessage = '';
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  toNull(val: string | null | undefined): string | null {
    return val?.trim() || null;
  }

  submit(): void {
    if (!this.supplier?.id || this.form.invalid || this.submitting) return;
    this.errorMessage = '';
    this.submitting = true;
    const value = this.form.getRawValue();
    const payload = {
      name: value.name,
      phone: this.toNull(value.phone),
      email: this.toNull(value.email),
      address: this.toNull(value.address),
    };
    this.supplierService.edit(String(this.supplier.id), payload).subscribe({
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
