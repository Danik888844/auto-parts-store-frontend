import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../general-components/loading/loading.component';

@Component({
  selector: 'app-new-client',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent,
  ],
  templateUrl: './new-client.component.html',
  styleUrl: './new-client.component.scss',
})
export class NewClientComponent {
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  isLoading = false;
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
      fullName: value.fullName,
      phone: this.toNull(value.phone),
      email: this.toNull(value.email),
      notes: this.toNull(value.notes),
    };
    this.clientService.create(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.saveData.emit();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
