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
import { SupplierService } from '../../core/services/supplier.service';
import { PaginationReturnDto } from '../../core/models/general/pagination-return-dto';
import { SupplierDto } from '../../core/models/supplier/supplier-dto';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from '../general-components/popup/popup.component';
import { NewSupplierComponent } from './new-supplier/new-supplier.component';
import { EditSupplierComponent } from './edit-supplier/edit-supplier.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    AgGridListComponent,
    PaginationComponent,
    PopupComponent,
    NewSupplierComponent,
    EditSupplierComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
})
export class SuppliersComponent implements OnInit {
  page = 1;
  pageView = 20;
  query = '';
  searchInput = '';
  private searchSubject = new Subject<string>();
  paginationInfo: PaginationReturnDto | null = null;

  selectedSupplier: SupplierDto | null = null;
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

  showSupplierModal = false;
  isNew = true;
  supplierForEdit: SupplierDto | null = null;

  constructor(
    private supplierService: SupplierService,
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
        field: 'name',
        headerName: this.translateService.instant('Name'),
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'phone',
        headerName: this.translateService.instant('Phone'),
        flex: 1,
        minWidth: 120,
        valueGetter: (params) => params.data?.phone ?? '',
      },
      {
        field: 'email',
        headerName: this.translateService.instant('Email'),
        flex: 1,
        minWidth: 150,
        valueGetter: (params) => params.data?.email ?? '',
      },
      {
        field: 'address',
        headerName: this.translateService.instant('Address'),
        flex: 1,
        minWidth: 150,
        valueGetter: (params) => params.data?.address ?? '',
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
    this.supplierService
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
    this.selectedSupplier = rows.length ? (rows[0] as SupplierDto) : null;
  }

  onRowDataUpdated(): void {}

  openNewSupplier(): void {
    this.isNew = true;
    this.supplierForEdit = null;
    this.showSupplierModal = true;
  }

  openEditSupplier(): void {
    if (!this.selectedSupplier?.id) return;
    this.isNew = false;
    this.supplierForEdit = this.selectedSupplier;
    this.showSupplierModal = true;
  }

  closeSupplierPopup(): void {
    this.showSupplierModal = false;
    this.supplierForEdit = null;
  }

  onSupplierSaved(): void {
    this.showSupplierModal = false;
    this.supplierForEdit = null;
    if (this.isNew) this.page = 1;
    this.getList();
  }

  deleteSupplier(): void {
    if (!this.selectedSupplier?.id) return;
    if (
      !confirm(
        this.translateService.instant('DeleteSupplier', {
          name: this.selectedSupplier.name,
        }),
      )
    )
      return;
    this.supplierService.delete(String(this.selectedSupplier.id)).subscribe({
      next: () => {
        this.selectedSupplier = null;
        this.getList();
      },
    });
  }
}
