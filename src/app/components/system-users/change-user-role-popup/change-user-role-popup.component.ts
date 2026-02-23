import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserDto } from '../../../core/models/users/user-dto';
import { UserService } from '../../../core/services/user.service';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export const ROLE_ADMINISTRATOR = 'Administrator';
export const ROLE_SELLER = 'Seller';
const ROLES = [ROLE_ADMINISTRATOR, ROLE_SELLER];

@Component({
  selector: 'app-change-user-role-popup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './change-user-role-popup.component.html',
  styleUrl: './change-user-role-popup.component.scss',
})
export class ChangeUserRolePopupComponent implements OnChanges {
  @Input() user: UserDto | null = null;
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  submitting = false;
  errorMessage = '';

  readonly roles = ROLES;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.form = this.fb.group({
      role: [null as string | null, [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      const currentRole =
        this.user?.roles?.find((r) => ROLES.includes(r)) ?? null;
      this.form.patchValue({ role: currentRole });
      this.errorMessage = '';
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  submit(): void {
    if (!this.user?.id || this.form.invalid || this.submitting) return;
    this.errorMessage = '';
    this.submitting = true;
    const role = this.form.get('role')?.value as string;
    if (!role) return;
    this.userService
      .changeRole({ userId: this.user.id, role })
      .subscribe({
        next: (res) => {
          this.submitting = false;
          if (res.result) {
            this.saveData.emit();
          } else {
            this.errorMessage = res.message || 'Ошибка';
          }
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage = err?.error?.message || 'Ошибка при сохранении';
        },
      });
  }
}
