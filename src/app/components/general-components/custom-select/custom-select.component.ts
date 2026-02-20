import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
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
export class CustomSelectComponent
  implements ControlValueAccessor, OnInit, OnDestroy, OnChanges
{
  /** Массив объектов для списка (любые объекты с полями valueKey и labelKey) */
  @Input() items: unknown[] = [];

  /** Выбранный объект для отображения, когда его нет в текущем items (например, выбран через поиск) */
  private selectedDisplayItem: unknown = null;

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

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((term) => this.searchChange.emit(term ?? ''));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.syncSelectedDisplayItem();
    }
  }

  writeValue(value: unknown): void {
    this.value = value;
    this.syncSelectedDisplayItem();
    this.cdr.markForCheck();
  }

  /** Поддерживает отображение выбранного элемента, когда его нет в текущем items */
  private syncSelectedDisplayItem(): void {
    if (this.value == null) {
      this.selectedDisplayItem = null;
      return;
    }
    const found = this.items.find((i) =>
      this.valuesEqual(this.getValue(i), this.value),
    );
    if (found != null) {
      this.selectedDisplayItem = found;
    }
  }

  private valuesEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    return String(a) === String(b);
  }

  /** Список опций для отображения: текущие items + выбранный элемент, если его нет в списке */
  get displayItems(): unknown[] {
    if (this.value == null) return this.items;
    const hasSelected = this.items.some((i) =>
      this.valuesEqual(this.getValue(i), this.value),
    );
    if (hasSelected) return this.items;
    if (
      this.selectedDisplayItem != null &&
      this.valuesEqual(this.getValue(this.selectedDisplayItem), this.value)
    ) {
      return [this.selectedDisplayItem, ...this.items];
    }
    return this.items;
  }

  onSelectionChange(event: MatSelectChange): void {
    this.value = event.value ?? null;
    const item = this.items.find((i) =>
      this.valuesEqual(this.getValue(i), this.value),
    );
    if (item != null) {
      this.selectedDisplayItem = item;
    }
    this.onChange(this.value);
    this.onTouched();
    this.cdr.markForCheck();
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
    return (item != null && typeof item === 'object' ? item : {}) as Record<
      string,
      unknown
    >;
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
}
