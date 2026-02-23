import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { UserDto } from '../../../core/models/users/user-dto';
import { EditUserDto } from '../../../core/models/users/edit-user-dto';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCheckboxModule,
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent implements OnChanges {
  @Input() user: UserDto | null = null;
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(200)]],
      lastName: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.maxLength(200), Validators.email]],
      phoneNumber: ['', [Validators.maxLength(50)]],
      isActive: [true],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']?.currentValue) {
      this.form.patchValue({
        firstName: this.user?.firstName ?? '',
        lastName: this.user?.lastName ?? '',
        email: this.user?.email ?? '',
        phoneNumber: this.user?.phoneNumber ?? '',
        isActive: this.user?.isActive ?? true,
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
    if (!this.user?.id || this.form.invalid || this.submitting) return;
    this.errorMessage = '';
    this.submitting = true;
    const value = this.form.getRawValue();
    const payload: EditUserDto = {
      id: this.user.id,
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      email: value.email.trim(),
      phoneNumber: this.toNull(value.phoneNumber),
      isActive: !!value.isActive,
    };
    this.userService.edit(this.user.id, payload).subscribe({
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
