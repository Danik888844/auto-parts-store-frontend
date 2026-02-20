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
import { ProductService } from '../../core/services/product.service';
import { PaginationReturnDto } from '../../core/models/general/pagination-return-dto';
import { ProductDto } from '../../core/models/product/product-dto';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from '../general-components/popup/popup.component';
import { NewProductComponent } from './new-product/new-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    AgGridListComponent,
    PaginationComponent,
    PopupComponent,
    NewProductComponent,
    EditProductComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  page = 1;
  pageView = 20;
  query = '';
  searchInput = '';
  private searchSubject = new Subject<string>();
  paginationInfo: PaginationReturnDto | null = null;

  selectedProduct: ProductDto | null = null;
  public domLayout: DomLayoutType = 'autoHeight';
  protected gridApi!: GridApi;

  colDefs: ColDef[] = [];
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

  showProductModal = false;
  isNew = true;
  productForEdit: ProductDto | null = null;

  constructor(
    private productService: ProductService,
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
        field: 'sku',
        headerName: this.translateService.instant('Sku'),
        valueGetter: (params) =>
          (params.data &&
            ((params.data as any).Sku ?? (params.data as any).sku)) ??
          '',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'name',
        headerName: this.translateService.instant('Name'),
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'category',
        headerName: this.translateService.instant('Category'),
        valueGetter: (params) => params.data?.category?.name ?? '',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'manufacturer',
        headerName: this.translateService.instant('Manufacturer'),
        valueGetter: (params) => params.data?.manufacturer?.name ?? '',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'price',
        headerName: this.translateService.instant('Price'),
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'isActive',
        headerName: this.translateService.instant('IsActive'),
        valueGetter: (params) =>
          params.data?.isActive
            ? this.translateService.instant('Yes')
            : this.translateService.instant('No'),
        flex: 1,
        minWidth: 80,
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
    this.productService
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
    this.selectedProduct = rows.length ? (rows[0] as ProductDto) : null;
  }

  onRowDataUpdated(): void {}

  openNewProduct(): void {
    this.isNew = true;
    this.productForEdit = null;
    this.showProductModal = true;
  }

  openEditProduct(): void {
    if (!this.selectedProduct?.id) return;
    this.isNew = false;
    this.productForEdit = this.selectedProduct;
    this.showProductModal = true;
  }

  closeProductPopup(): void {
    this.showProductModal = false;
    this.productForEdit = null;
  }

  onProductSaved(): void {
    this.showProductModal = false;
    this.productForEdit = null;
    if (this.isNew) this.page = 1;
    this.getList();
  }

  deleteProduct(): void {
    if (!this.selectedProduct?.id) return;
    if (
      !confirm(
        this.translateService.instant('DeleteProduct', {
          name: this.selectedProduct.name,
        }),
      )
    )
      return;
    this.productService.delete(String(this.selectedProduct.id)).subscribe({
      next: () => {
        this.selectedProduct = null;
        this.getList();
      },
    });
  }
}
