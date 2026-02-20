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
import { ClientService } from '../../core/services/client.service';
import { PaginationReturnDto } from '../../core/models/general/pagination-return-dto';
import { ClientDto } from '../../core/models/client/client-dto';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from '../general-components/popup/popup.component';
import { NewClientComponent } from './new-client/new-client.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    AgGridListComponent,
    PaginationComponent,
    PopupComponent,
    NewClientComponent,
    EditClientComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent implements OnInit {
  page = 1;
  pageView = 20;
  query = '';
  searchInput = '';
  private searchSubject = new Subject<string>();
  paginationInfo: PaginationReturnDto | null = null;

  selectedClient: ClientDto | null = null;
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

  showClientModal = false;
  isNew = true;
  clientForEdit: ClientDto | null = null;

  constructor(
    private clientService: ClientService,
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
        field: 'fullName',
        headerName: this.translateService.instant('FullName'),
        flex: 1,
        minWidth: 180,
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
        field: 'notes',
        headerName: this.translateService.instant('Notes'),
        flex: 1,
        minWidth: 150,
        valueGetter: (params) => params.data?.notes ?? '',
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
    this.clientService
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
    this.selectedClient = rows.length ? (rows[0] as ClientDto) : null;
  }

  onRowDataUpdated(): void {}

  openNewClient(): void {
    this.isNew = true;
    this.clientForEdit = null;
    this.showClientModal = true;
  }

  openEditClient(): void {
    if (!this.selectedClient?.id) return;
    this.isNew = false;
    this.clientForEdit = this.selectedClient;
    this.showClientModal = true;
  }

  closeClientPopup(): void {
    this.showClientModal = false;
    this.clientForEdit = null;
  }

  onClientSaved(): void {
    this.showClientModal = false;
    this.clientForEdit = null;
    if (this.isNew) this.page = 1;
    this.getList();
  }

  deleteClient(): void {
    if (!this.selectedClient?.id) return;
    if (
      !confirm(
        this.translateService.instant('DeleteClient', {
          name: this.selectedClient.fullName,
        }),
      )
    )
      return;
    this.clientService.delete(String(this.selectedClient.id)).subscribe({
      next: () => {
        this.selectedClient = null;
        this.getList();
      },
    });
  }
}
