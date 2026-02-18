import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SupplierService } from '../../../core/services/supplier.service';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../general-components/loading/loading.component';

@Component({
  selector: 'app-new-supplier',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent,
  ],
  templateUrl: './new-supplier.component.html',
  styleUrl: './new-supplier.component.scss',
})
export class NewSupplierComponent {
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  isLoading = false;
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

  onCancel(): void {
    this.cancel.emit();
  }

  toNull(val: string | null | undefined): string | null {
    return val?.trim() || null;
  }

  submit(): void {
    if (this.form.invalid || this.isLoading) return;

    this.errorMessage = '';
    this.isLoading = true;
    const value = this.form.getRawValue();
    const payload = {
      name: value.name,
      phone: this.toNull(value.phone),
      email: this.toNull(value.email),
      address: this.toNull(value.address),
    };
    this.supplierService.create(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.form.reset({ name: '', phone: '', email: '', address: '' });
        this.saveData.emit();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
