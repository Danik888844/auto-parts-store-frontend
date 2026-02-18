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
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

/**
 * Универсальный select: массив объектов, настраиваемые поля для value и отображаемого текста.
 * По умолчанию: valueKey = 'id', labelKey = 'name'.
 * Поддерживает пустой вариант (placeholder).
 */
@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [FormsModule],
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

  /** Дополнительные CSS-классы для select (например, form-control popup-input) */
  @Input() class = 'form-control popup-input';

  /** Показывать поле поиска; при вводе эмитится searchChange (для загрузки списка с сервера по поиску) */
  @Input() searchable = false;

  /** Placeholder для поля поиска */
  @Input() searchPlaceholder = '';

  /** Эмитится при вводе в поле поиска (с debounce). Подпишитесь для загрузки items с учётом search */
  @Output() searchChange = new EventEmitter<string>();

  value: unknown = null;
  disabled = false;
  searchQuery = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  onChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((term) => this.searchChange.emit(term));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery.trim());
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

  onSelectChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;
    if (selectedValue === '') {
      this.value = null;
      this.onChange(null);
    } else {
      const item = this.items.find(
        (i) => String(this.getValue(i)) === selectedValue,
      );
      const val = item ? this.getValue(item) : null;
      this.value = val;
      this.onChange(val);
    }
    this.onTouched();
  }

  get selectedValue(): string {
    if (this.value == null) return '';
    return String(this.value);
  }
}
