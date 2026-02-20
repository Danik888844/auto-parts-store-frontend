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
import { ProductCompatibilityService } from '../../core/services/product-compatibility.service';
import { PaginationReturnDto } from '../../core/models/general/pagination-return-dto';
import { ProductCompatibilityDto } from '../../core/models/product-compatibility/product-compatibility-dto';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from '../general-components/popup/popup.component';
import { NewProductCompatibilityComponent } from './new-product-compatibility/new-product-compatibility.component';
import { EditProductCompatibilityComponent } from './edit-product-compatibility/edit-product-compatibility.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-compatibilities',
  standalone: true,
  imports: [
    AgGridListComponent,
    PaginationComponent,
    PopupComponent,
    NewProductCompatibilityComponent,
    EditProductCompatibilityComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './product-compatibilities.component.html',
  styleUrl: './product-compatibilities.component.scss',
})
export class ProductCompatibilitiesComponent implements OnInit {
  page = 1;
  pageView = 20;
  query = '';
  searchInput = '';
  private searchSubject = new Subject<string>();
  paginationInfo: PaginationReturnDto | null = null;

  selectedItem: ProductCompatibilityDto | null = null;
  public domLayout: DomLayoutType = 'autoHeight';
  protected gridApi!: GridApi;

  colDefs: ColDef[] = [];
  gridOptions: GridOptions = { suppressCellFocus: true };
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

  showModal = false;
  isNew = true;
  itemForEdit: ProductCompatibilityDto | null = null;

  constructor(
    private productCompatibilityService: ProductCompatibilityService,
    public translateService: TranslateService,
  ) {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.query = term;
        this.page = 1;
        this.getList();
      });
    this.colDefs = [
      {
        field: 'product',
        headerName: this.translateService.instant('Product'),
        valueGetter: (params) => {
          const p = params.data?.product;
          if (!p) return '';
          const sku = (p as any).Sku ?? (p as any).sku ?? '';
          const name = (p as any).name ?? '';
          return sku ? `${sku} ${name ? '- ' + name : ''}`.trim() : name;
        },
        flex: 1,
        minWidth: 180,
      },
      {
        field: 'vehicle',
        headerName: this.translateService.instant('Vehicle'),
        valueGetter: (params) => {
          const v = params.data?.vehicle;
          if (!v) return '';
          const m = (v as any).model;
          const modelName = m
            ? (m as any).brand
              ? `${(m as any).brand.name} ${(m as any).name}`
              : (m as any).name
            : '';
          const yFrom = (v as any).yearFrom ?? '';
          const yTo = (v as any).yearTo ?? '';
          return modelName + (yFrom || yTo ? ` (${yFrom}-${yTo})` : '');
        },
        flex: 1,
        minWidth: 180,
      },
      {
        field: 'comment',
        headerName: this.translateService.instant('Comment'),
        valueGetter: (params) => params.data?.comment ?? '',
        flex: 1,
        minWidth: 120,
      },
    ];
  }

  ngOnInit(): void {
    this.getList();
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchInput.trim());
  }

  getList(): void {
    this.productCompatibilityService
      .getList({
        search: this.query,
        viewSize: this.pageView,
        pageNumber: this.page,
      })
      .subscribe((res) => {
        this.rowData = res.data.items;
        this.paginationInfo = res.data.pagination;
      });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.getList();
  }

  onViewSizeChange(viewSize: number): void {
    this.pageView = viewSize;
    this.page = 1;
    this.getList();
  }

  getPaginationInfo(pagination: PaginationReturnDto): PaginationInfo | null {
    if (!pagination) return null;
    const startItem = (pagination.currentPage - 1) * pagination.pageSize + 1;
    const endItem = Math.min(
      pagination.currentPage * pagination.pageSize,
      pagination.totalItems,
    );
    return {
      startItem,
      endItem,
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
    this.selectedItem = rows.length
      ? (rows[0] as ProductCompatibilityDto)
      : null;
  }

  onRowDataUpdated(): void {}

  openNew(): void {
    this.isNew = true;
    this.itemForEdit = null;
    this.showModal = true;
  }

  openEdit(): void {
    if (!this.selectedItem?.id) return;
    this.isNew = false;
    this.itemForEdit = this.selectedItem;
    this.showModal = true;
  }

  closePopup(): void {
    this.showModal = false;
    this.itemForEdit = null;
  }

  onSaved(): void {
    this.showModal = false;
    this.itemForEdit = null;
    if (this.isNew) this.page = 1;
    this.getList();
  }

  deleteItem(): void {
    if (!this.selectedItem?.id) return;
    const label = this.selectedItem.product?.name
      ? `${this.selectedItem.product.name} / ${this.selectedItem.vehicle?.model?.name ?? ''}`
      : this.selectedItem.id;
    if (
      !confirm(
        this.translateService.instant('DeleteProductCompatibility', {
          name: label,
        }),
      )
    )
      return;
    this.productCompatibilityService
      .delete(String(this.selectedItem.id))
      .subscribe({
        next: () => {
          this.selectedItem = null;
          this.getList();
        },
      });
  }
}
