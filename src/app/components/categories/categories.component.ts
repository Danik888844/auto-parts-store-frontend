import { Component, OnInit } from '@angular/core';
import { AgGridListComponent } from '../general-components/ag-grid-list/ag-grid-list.component';
import {
  PaginationComponent,
  PaginationInfo,
} from '../general-components/pagination/pagination.component';
import {
  ColDef,
  DomLayoutType,
  GridApi,
  GridOptions,
  RowSelectionOptions,
  SelectionChangedEvent,
  SelectionColumnDef,
} from 'ag-grid-community';
import { CategoryService } from '../../core/services/category.service';
import { PaginationReturnDto } from '../../core/models/general/pagination-return-dto';
import { CategoryDto } from '../../core/models/category/category-dto';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from '../general-components/popup/popup.component';
import { NewCategoryComponent } from './new-category/new-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    AgGridListComponent,
    PaginationComponent,
    PopupComponent,
    NewCategoryComponent,
    EditCategoryComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    FormsModule,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  page = 1;
  pageView = 20;
  query = '';
  searchInput = '';
  private searchSubject = new Subject<string>();
  paginationInfo: PaginationReturnDto | null = null;

  selectedCategory: CategoryDto | null = null;
  public domLayout: DomLayoutType = 'autoHeight';
  protected gridApi!: GridApi;

  colDefs: ColDef[] = [
    { field: 'name', headerName: 'Название', flex: 1, minWidth: 150 },
  ];
  gridOptions: GridOptions = {
    suppressCellFocus: true,
  };
  rowData: any[] = [];
  public rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
    mode: 'singleRow',
  };
  public selectionColumnDef: SelectionColumnDef = {
    sortable: true,
    resizable: true,
    width: 50,
    maxWidth: 100,
    suppressHeaderMenuButton: false,
    pinned: 'left',
  };

  showCategoryModal = false;
  isNew = true;
  categoryForEdit: CategoryDto | null = null;

  constructor(private categoryService: CategoryService) {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((term) => {
      this.query = term;
      this.page = 1;
      this.getList();
    });
  }

  ngOnInit(): void {
    this.getList();
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchInput.trim());
  }

  getList(): void {
    this.categoryService
      .getList({
        search: this.query,
        viewSize: this.pageView,
        pageNumber: this.page,
      })
      .subscribe((response) => {
        this.rowData = response.items;
        this.paginationInfo = response.pagination;
      });
  }

  /**
   * Обработчик изменения страницы
   */
  onPageChange(page: number): void {
    this.page = page;
    this.getList();
  }

  /**
   * Обработчик изменения размера страницы
   */
  onViewSizeChange(viewSize: number): void {
    this.pageView = viewSize;
    this.page = 1; // Сбрасываем на первую страницу при изменении размера
    this.getList();
  }

  getPaginationInfo(pagination: PaginationReturnDto): PaginationInfo | null {
    if (!pagination) {
      return null;
    }

    const startItem = (pagination.currentPage - 1) * pagination.pageSize + 1;
    const endItem = Math.min(
      pagination.currentPage * pagination.pageSize,
      pagination.totalItems,
    );

    return {
      startItem: startItem,
      endItem: endItem,
      totalItems: pagination.totalItems,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      hasPrevious: pagination.currentPage > 1,
      hasNext: pagination.currentPage < pagination.totalPages,
    };
  }

  onGridReady(params: { api: GridApi }): void {
    this.gridApi = params.api;
  }

  onSelectionChanged(event: SelectionChangedEvent): void {
    const rows = event.api.getSelectedRows();
    this.selectedCategory = rows.length ? (rows[0] as CategoryDto) : null;
  }

  onRowDataUpdated(): void {}

  openNewCategory(): void {
    this.isNew = true;
    this.categoryForEdit = null;
    this.showCategoryModal = true;
  }

  openEditCategory(): void {
    if (!this.selectedCategory?.id) return;
    this.isNew = false;
    this.categoryForEdit = this.selectedCategory;
    this.showCategoryModal = true;
  }

  closeCategoryPopup(): void {
    this.showCategoryModal = false;
    this.categoryForEdit = null;
  }

  onCategorySaved(): void {
    this.showCategoryModal = false;
    this.categoryForEdit = null;
    if (this.isNew) this.page = 1;
    this.getList();
  }

  deleteCategory(): void {
    if (!this.selectedCategory?.id) return;
    if (!confirm('Удалить категорию «' + this.selectedCategory.name + '»?')) return;
    this.categoryService.delete(this.selectedCategory.id).subscribe({
      next: () => {
        this.selectedCategory = null;
        this.getList();
      },
    });
  }
}
