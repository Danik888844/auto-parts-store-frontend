import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-new-category',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.scss',
})
export class NewCategoryComponent {
  @Output() saveData = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  submit(): void {
    if (this.form.invalid || this.submitting) return;
    this.errorMessage = '';
    this.submitting = true;
    this.categoryService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting = false;
        this.saveData.emit();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage =
          err?.error?.message || 'Ошибка при создании категории';
      },
    });
  }
}
