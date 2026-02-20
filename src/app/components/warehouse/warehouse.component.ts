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
} from 'ag-grid-community';
import { StockService } from '../../core/services/stock.service';
import { StockMovementService } from '../../core/services/stock-movement.service';
import { PaginationReturnDto } from '../../core/models/general/pagination-return-dto';
import { StockDto } from '../../core/models/stock/stock-dto';
import { StockMovementDto } from '../../core/models/stock-movement/stock-movement-dto';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from '../general-components/popup/popup.component';
import { NewStockMovementComponent } from './new-stock-movement/new-stock-movement.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

type TabType = 'stock' | 'movements';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [
    AgGridListComponent,
    PaginationComponent,
    PopupComponent,
    NewStockMovementComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss',
})
export class WarehouseComponent implements OnInit {
  activeTab: TabType = 'stock';
  page = 1;
  pageView = 20;
  query = '';
  searchInput = '';
  private searchSubject = new Subject<string>();

  stockPagination: PaginationReturnDto | null = null;
  movementsPagination: PaginationReturnDto | null = null;

  stockRowData: StockDto[] = [];
  movementsRowData: StockMovementDto[] = [];

  public domLayout: DomLayoutType = 'autoHeight';
  protected gridApiStock!: GridApi;
  protected gridApiMovements!: GridApi;

  stockColDefs: ColDef[] = [];
  movementsColDefs: ColDef[] = [];
  gridOptions: GridOptions = { suppressCellFocus: true };

  showNewMovementModal = false;

  constructor(
    private stockService: StockService,
    private stockMovementService: StockMovementService,
    public translateService: TranslateService,
  ) {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.query = term;
        this.page = 1;
        this.loadCurrentTab();
      });

    this.stockColDefs = [
      {
        field: 'sku',
        headerName: this.translateService.instant('Sku'),
        valueGetter: (params) => params.data?.product?.Sku ?? params.data?.product?.sku ?? '',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'productName',
        headerName: this.translateService.instant('Name'),
        valueGetter: (params) => params.data?.product?.name ?? '',
        flex: 1,
        minWidth: 180,
      },
      {
        field: 'quantity',
        headerName: this.translateService.instant('Quantity'),
        flex: 1,
        minWidth: 100,
      },
    ];

    this.movementsColDefs = [
      {
        field: 'occurredAt',
        headerName: this.translateService.instant('Date'),
        valueFormatter: (params) => {
          if (!params.value) return '';
          const d = new Date(params.value);
          return d.toLocaleString();
        },
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'type',
        headerName: this.translateService.instant('StockMovementType'),
        valueGetter: (params) => {
          const t = params.data?.type;
          if (!t) return '';
          return this.translateService.instant('StockMovementType_' + t);
        },
        flex: 1,
        minWidth: 90,
      },
      {
        field: 'product',
        headerName: this.translateService.instant('Product'),
        valueGetter: (params) => {
          const p = params.data?.product;
          if (!p) return '';
          const sku = p.Sku ?? p.sku ?? '';
          return sku ? `${sku} — ${p.name ?? ''}` : (p.name ?? '');
        },
        flex: 1,
        minWidth: 180,
      },
      {
        field: 'quantity',
        headerName: this.translateService.instant('Quantity'),
        flex: 1,
        minWidth: 80,
      },
      {
        field: 'reason',
        headerName: this.translateService.instant('Reason'),
        valueGetter: (params) => params.data?.reason ?? '—',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'documentNo',
        headerName: this.translateService.instant('DocumentNo'),
        valueGetter: (params) => params.data?.documentNo ?? '—',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'user',
        headerName: this.translateService.instant('User'),
        valueGetter: (params) => params.data?.user?.fullName ?? params.data?.user?.userName ?? '—',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'supplier',
        headerName: this.translateService.instant('Supplier'),
        valueGetter: (params) => params.data?.supplier?.name ?? '—',
        flex: 1,
        minWidth: 120,
      },
    ];
  }

  ngOnInit(): void {
    this.loadCurrentTab();
  }

  setTab(tab: TabType): void {
    this.activeTab = tab;
    this.page = 1;
    this.loadCurrentTab();
  }

  loadCurrentTab(): void {
    if (this.activeTab === 'stock') this.loadStock();
    else this.loadMovements();
  }

  loadStock(): void {
    this.stockService
      .getList({
        search: this.query,
        viewSize: this.pageView,
        pageNumber: this.page,
      })
      .subscribe((res) => {
        this.stockRowData = res.data.items;
        this.stockPagination = res.data.pagination;
      });
  }

  loadMovements(): void {
    this.stockMovementService
      .getList({
        search: this.query,
        viewSize: this.pageView,
        pageNumber: this.page,
      })
      .subscribe((res) => {
        this.movementsRowData = res.data.items;
        this.movementsPagination = res.data.pagination;
      });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchInput.trim());
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadCurrentTab();
  }

  onViewSizeChange(viewSize: number): void {
    this.pageView = viewSize;
    this.page = 1;
    this.loadCurrentTab();
  }

  getPaginationInfo(pagination: PaginationReturnDto | null): PaginationInfo | null {
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

  get currentPagination(): PaginationReturnDto | null {
    return this.activeTab === 'stock' ? this.stockPagination : this.movementsPagination;
  }

  onGridReadyStock(params: { api: GridApi }): void {
    this.gridApiStock = params.api;
  }

  onGridReadyMovements(params: { api: GridApi }): void {
    this.gridApiMovements = params.api;
  }

  openNewMovement(): void {
    this.showNewMovementModal = true;
  }

  closeNewMovementModal(): void {
    this.showNewMovementModal = false;
  }

  onMovementCreated(): void {
    this.showNewMovementModal = false;
    this.loadStock();
    this.loadMovements();
  }
}
