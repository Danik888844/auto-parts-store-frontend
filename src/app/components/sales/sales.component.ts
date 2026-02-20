import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { SaleService } from '../../core/services/sale.service';
import { PaginationReturnDto } from '../../core/models/general/pagination-return-dto';
import { SaleDto } from '../../core/models/sale/sale-dto';
import { SaleStatus } from '../../core/models/sale/sale-status';
import { PaymentType } from '../../core/models/sale/payment-type';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    AgGridListComponent,
    PaginationComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesComponent implements OnInit {
  page = 1;
  pageView = 20;
  query = '';
  searchInput = '';
  private searchSubject = new Subject<string>();
  paginationInfo: PaginationReturnDto | null = null;

  selectedSale: SaleDto | null = null;
  public domLayout: DomLayoutType = 'autoHeight';
  protected gridApi!: GridApi;

  colDefs: ColDef[] = [];
  gridOptions: GridOptions = {
    suppressCellFocus: true,
    onRowDoubleClicked: (event) => {
      if (event.data?.id != null) {
        this.router.navigate(['/sales', String(event.data.id)]);
      }
    },
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

  constructor(
    private saleService: SaleService,
    public translateService: TranslateService,
    private router: Router,
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
        field: 'id',
        headerName: 'ID',
        flex: 0,
        width: 80,
      },
      {
        field: 'soldAt',
        headerName: this.translateService.instant('SoldAt'),
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'client',
        headerName: this.translateService.instant('Client'),
        valueGetter: (params) => params.data?.client?.fullName ?? '',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'total',
        headerName: this.translateService.instant('Total'),
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'status',
        headerName: this.translateService.instant('Status'),
        valueGetter: (params) => this.statusLabel(params.data?.status),
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'paymentType',
        headerName: this.translateService.instant('PaymentType'),
        valueGetter: (params) =>
          this.paymentTypeLabel(params.data?.paymentType),
        flex: 1,
        minWidth: 100,
      },
    ];
  }

  private statusLabel(s: SaleStatus | undefined): string {
    if (s == null) return '';
    const key = SaleStatus[s] ?? '';
    return key ? this.translateService.instant(key) : String(s);
  }

  private paymentTypeLabel(p: PaymentType | undefined): string {
    if (p == null) return '';
    const key = PaymentType[p] ?? '';
    return key ? this.translateService.instant(key) : String(p);
  }

  ngOnInit(): void {
    this.getList();
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchInput.trim());
  }

  getList(): void {
    this.saleService
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
    this.selectedSale = rows.length ? (rows[0] as SaleDto) : null;
  }

  onRowDataUpdated(): void {}

  openNew(): void {
    this.router.navigate(['/sales/new']);
  }

  openDetail(): void {
    const id = this.selectedSale?.id;
    if (id == null) return;
    this.router.navigate(['/sales', String(id)]);
  }
}
