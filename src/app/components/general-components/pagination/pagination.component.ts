import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

export interface PaginationInfo {
  startItem: number;
  endItem: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule, FormsModule],
  template: `
    @if (paginationInfo) {
      <div class="custom-pagination">
        <div class="page-size-selector">
          <label>{{ 'AG_GRID.pageSizeSelectorLabel' | translate }}</label>
          <select
            [(ngModel)]="viewSize"
            (change)="onPageSizeChange($event)"
            class="form-control page-size-select"
          >
            @if (isShortPageSize) {
              <option [value]="5">5</option>
              <option [value]="10">10</option>
              <option [value]="15">15</option>
              <option [value]="20">20</option>
            } @else {
              <option [value]="20">20</option>
              <option [value]="30">30</option>
              <option [value]="40">40</option>
              <option [value]="50">50</option>
            }
          </select>
        </div>

        <div class="pagination-info">
          {{ paginationInfo.startItem }} {{ 'AG_GRID.to' | translate }}
          {{ paginationInfo.endItem }} {{ 'AG_GRID.of' | translate }}
          {{ paginationInfo.totalItems }}
        </div>

        <div class="pagination-controls">
          <button
            class="pagination-button"
            [disabled]="!paginationInfo.hasPrevious"
            (click)="goToFirstPage()"
            [attr.aria-label]="'FirstPage' | translate"
          >
            <mat-icon>first_page</mat-icon>
          </button>
          <button
            class="pagination-button"
            [disabled]="!paginationInfo.hasPrevious"
            (click)="goToPreviousPage()"
            [attr.aria-label]="'PreviousPage' | translate"
          >
            <mat-icon>chevron_left</mat-icon>
          </button>
          <span class="page-indicator">
            {{ 'AG_GRID.page' | translate }} {{ paginationInfo.currentPage }}
            {{ 'AG_GRID.of' | translate }} {{ paginationInfo.totalPages }}
          </span>
          <button
            class="pagination-button"
            [disabled]="!paginationInfo.hasNext"
            (click)="goToNextPage()"
            [attr.aria-label]="'NextPage' | translate"
          >
            <mat-icon>chevron_right</mat-icon>
          </button>
          <button
            class="pagination-button"
            [disabled]="!paginationInfo.hasNext"
            (click)="goToLastPage()"
            [attr.aria-label]="'LastPage' | translate"
          >
            <mat-icon>last_page</mat-icon>
          </button>
        </div>
      </div>
    }
  `,
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() paginationInfo: PaginationInfo | null = null;
  @Input() viewSize: number = 20;
  @Input() isShortPageSize: boolean = false;
  @Output() pageChange = new EventEmitter<number>();
  @Output() viewSizeChange = new EventEmitter<number>();

  goToFirstPage(): void {
    this.pageChange.emit(1);
  }

  goToPreviousPage(): void {
    if (this.paginationInfo?.hasPrevious) {
      this.pageChange.emit(this.paginationInfo.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.paginationInfo?.hasNext) {
      this.pageChange.emit(this.paginationInfo.currentPage + 1);
    }
  }

  goToLastPage(): void {
    if (this.paginationInfo?.totalPages) {
      this.pageChange.emit(this.paginationInfo.totalPages);
    }
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newSize = parseInt(target.value, 10);
    this.viewSizeChange.emit(newSize);
  }
}
