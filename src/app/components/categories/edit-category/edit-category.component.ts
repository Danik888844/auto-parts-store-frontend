import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
import { CategoryDto } from '../../../core/models/category/category-dto';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss',
})
export class EditCategoryComponent implements OnChanges {
  @Input() category: CategoryDto | null = null;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category']?.currentValue) {
      this.form.patchValue({ name: this.category?.name ?? '' });
      this.errorMessage = '';
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  submit(): void {
    if (!this.category?.id || this.form.invalid || this.submitting) return;
    this.errorMessage = '';
    this.submitting = true;
    this.categoryService.edit(this.category.id, this.form.getRawValue()).subscribe({
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
