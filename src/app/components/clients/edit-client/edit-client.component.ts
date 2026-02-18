import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { ClientDto } from '../../../core/models/client/client-dto';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.scss',
})
export class EditClientComponent implements OnChanges {
  @Input() client: ClientDto | null = null;
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(200)]],
      phone: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.maxLength(200), Validators.email]],
      notes: ['', [Validators.maxLength(1000)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['client']?.currentValue) {
      this.form.patchValue({
        fullName: this.client?.fullName ?? '',
        phone: this.client?.phone ?? '',
        email: this.client?.email ?? '',
        notes: this.client?.notes ?? '',
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
    if (!this.client?.id || this.form.invalid || this.submitting) return;
    this.errorMessage = '';
    this.submitting = true;
    const value = this.form.getRawValue();
    const payload = {
      fullName: value.fullName,
      phone: this.toNull(value.phone),
      email: this.toNull(value.email),
      notes: this.toNull(value.notes),
    };
    this.clientService.edit(String(this.client.id), payload).subscribe({
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
