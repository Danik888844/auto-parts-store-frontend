import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Переиспользуемый popup: затемнённый фон и панель с проекцией контента.
 * Использование: <app-popup [isOpen]="show" (closed)="show = false"><content></app-popup>
 */
@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  onBackdropClick(): void {
    this.closed.emit();
  }

  onPanelClick(event: Event): void {
    event.stopPropagation();
  }
}
