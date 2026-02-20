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
import { ManufacturerService } from '../../core/services/manufacturer.service';
import { PaginationReturnDto } from '../../core/models/general/pagination-return-dto';
import { ManufacturerDto } from '../../core/models/manufacturer/manufacturer-dto';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from '../general-components/popup/popup.component';
import { NewManufacturerComponent } from './new-manufacturer/new-manufacturer.component';
import { EditManufacturerComponent } from './edit-manufacturer/edit-manufacturer.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-manufacturers',
  standalone: true,
  imports: [
    AgGridListComponent,
    PaginationComponent,
    PopupComponent,
    NewManufacturerComponent,
    EditManufacturerComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './manufacturers.component.html',
  styleUrl: './manufacturers.component.scss',
})
export class ManufacturersComponent implements OnInit {
  page = 1;
  pageView = 20;
  query = '';
  searchInput = '';
  private searchSubject = new Subject<string>();
  paginationInfo: PaginationReturnDto | null = null;

  selectedManufacturer: ManufacturerDto | null = null;
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

  showManufacturerModal = false;
  isNew = true;
  manufacturerForEdit: ManufacturerDto | null = null;

  constructor(
    private manufacturerService: ManufacturerService,
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
        field: 'country',
        headerName: this.translateService.instant('Country'),
        flex: 1,
        minWidth: 120,
        valueGetter: (params) => params.data?.country ?? '',
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
    this.manufacturerService
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
    this.selectedManufacturer = rows.length
      ? (rows[0] as ManufacturerDto)
      : null;
  }

  onRowDataUpdated(): void {}

  openNewManufacturer(): void {
    this.isNew = true;
    this.manufacturerForEdit = null;
    this.showManufacturerModal = true;
  }

  openEditManufacturer(): void {
    if (!this.selectedManufacturer?.id) return;
    this.isNew = false;
    this.manufacturerForEdit = this.selectedManufacturer;
    this.showManufacturerModal = true;
  }

  closeManufacturerPopup(): void {
    this.showManufacturerModal = false;
    this.manufacturerForEdit = null;
  }

  onManufacturerSaved(): void {
    this.showManufacturerModal = false;
    this.manufacturerForEdit = null;
    if (this.isNew) this.page = 1;
    this.getList();
  }

  deleteManufacturer(): void {
    if (!this.selectedManufacturer?.id) return;
    if (
      !confirm(
        this.translateService.instant('DeleteManufacturer', {
          name: this.selectedManufacturer.name,
        }),
      )
    )
      return;
    this.manufacturerService
      .delete(String(this.selectedManufacturer.id))
      .subscribe({
        next: () => {
          this.selectedManufacturer = null;
          this.getList();
        },
      });
  }
}
