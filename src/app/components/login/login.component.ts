import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../general-components/loading/loading.component';
import { UserService } from '../../core/services/user.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LoadingComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent {
  formGroup: FormGroup = new FormGroup<any>({
    email: new FormControl(),
    password: new FormControl(),
  });
  isLoading = signal<boolean>(false);

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.isLoading.set(true);
    const { email, password } = this.formGroup.value;

    this.userService.login({ email, password }).subscribe({
      next: (res) => {
        const token = res.data;

        localStorage.setItem(
          environment.authTokenName,
          JSON.stringify(token)
        );
        this.isLoading.set(false);

        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
