import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

/**
 * Универсальный select на базе Angular Material: mat-select + mat-option.
 * При searchable = true внутри выпадающего списка показывается ngx-mat-select-search.
 * По умолчанию: valueKey = 'id', labelKey = 'name'.
 */
@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    NgxMatSelectSearchModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss',
})
export class CustomSelectComponent implements ControlValueAccessor, OnInit, OnDestroy {
  /** Массив объектов для списка (любые объекты с полями valueKey и labelKey) */
  @Input() items: unknown[] = [];

  /** Поле объекта, используемое как value опции (по умолчанию id) */
  @Input() valueKey = 'id';

  /** Поле объекта, используемое для отображения в списке (по умолчанию name) */
  @Input() labelKey = 'name';

  /** Текст для пустого варианта (например, "Не выбрано"). Если не задан, пустой вариант не показывается */
  @Input() placeholder: string | null = null;

  /** id для связи с <label for="..."> */
  @Input() id: string | null = null;

  /** Показывать поле поиска внутри выпадающего списка (ngx-mat-select-search); при вводе эмитится searchChange */
  @Input() searchable = false;

  /** Placeholder для поля поиска внутри mat-select */
  @Input() searchPlaceholder = '';

  /** Эмитится при вводе в поле поиска (с debounce). Подпишитесь для загрузки items с учётом search */
  @Output() searchChange = new EventEmitter<string>();

  value: unknown = null;
  disabled = false;
  searchControl = new FormControl<string>('', { nonNullable: false });
  private destroy$ = new Subject<void>();
  onChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((term) => this.searchChange.emit(term ?? ''));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(value: unknown): void {
    this.value = value;
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private getItemRecord(item: unknown): Record<string, unknown> {
    return (item != null && typeof item === 'object' ? item : {}) as Record<string, unknown>;
  }

  getValue(item: unknown): unknown {
    return this.getItemRecord(item)[this.valueKey];
  }

  getLabel(item: unknown): string {
    const v = this.getItemRecord(item)[this.labelKey];
    return v != null ? String(v) : '';
  }

  getTrackValue(item: unknown): string {
    const v = this.getValue(item);
    return v != null ? String(v) : '';
  }

  onSelectionChange(event: MatSelectChange): void {
    this.value = event.value ?? null;
    this.onChange(this.value);
    this.onTouched();
  }
}
