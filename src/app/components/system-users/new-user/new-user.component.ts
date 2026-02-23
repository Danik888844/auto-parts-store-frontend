import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { CreateUserDto } from '../../../core/models/users/create-user-dto';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { LoadingComponent } from '../../general-components/loading/loading.component';

const ROLE_ADMINISTRATOR = 'Administrator';
const ROLE_SELLER = 'Seller';
const ROLES = [ROLE_ADMINISTRATOR, ROLE_SELLER];

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    MatSelectModule,
    LoadingComponent,
  ],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss',
})
export class NewUserComponent {
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  isLoading = false;
  errorMessage = '';

  readonly roles = ROLES;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(200)]],
      lastName: ['', [Validators.required, Validators.maxLength(200)]],
      userName: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.maxLength(200), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [null as string | null, [Validators.required]],
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
    const payload: CreateUserDto = {
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      userName: value.userName.trim(),
      email: value.email.trim(),
      password: value.password,
      role: value.role,
    };
    this.userService.create(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.form.reset({
          firstName: '',
          lastName: '',
          userName: '',
          email: '',
          password: '',
          role: null,
        });
        this.saveData.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Ошибка при создании';
      },
    });
  }
}
