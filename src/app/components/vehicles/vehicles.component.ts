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
import { VehicleService } from '../../core/services/vehicle.service';
import { PaginationReturnDto } from '../../core/models/general/pagination-return-dto';
import { VehicleDto } from '../../core/models/vehicle/vehicle-dto';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from '../general-components/popup/popup.component';
import { NewVehicleComponent } from './new-vehicle/new-vehicle.component';
import { EditVehicleComponent } from './edit-vehicle/edit-vehicle.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    AgGridListComponent,
    PaginationComponent,
    PopupComponent,
    NewVehicleComponent,
    EditVehicleComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss',
})
export class VehiclesComponent implements OnInit {
  page = 1;
  pageView = 20;
  query = '';
  searchInput = '';
  private searchSubject = new Subject<string>();
  paginationInfo: PaginationReturnDto | null = null;

  selectedVehicle: VehicleDto | null = null;
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
  itemForEdit: VehicleDto | null = null;

  constructor(
    private vehicleService: VehicleService,
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
        field: 'model',
        headerName: this.translateService.instant('VehicleModel'),
        valueGetter: (params) => {
          const m = params.data?.model;
          return m ? (m.brand ? `${m.brand.name} ${m.name}` : m.name) : '';
        },
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'yearFrom',
        headerName: this.translateService.instant('YearFrom'),
        flex: 1,
        minWidth: 80,
      },
      {
        field: 'yearTo',
        headerName: this.translateService.instant('YearTo'),
        flex: 1,
        minWidth: 80,
      },
      {
        field: 'generation',
        headerName: this.translateService.instant('Generation'),
        valueGetter: (params) => params.data?.generation ?? '',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'engine',
        headerName: this.translateService.instant('Engine'),
        valueGetter: (params) => params.data?.engine ?? '',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'bodyType',
        headerName: this.translateService.instant('BodyType'),
        valueGetter: (params) => params.data?.bodyType ?? '',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'note',
        headerName: this.translateService.instant('Note'),
        valueGetter: (params) => params.data?.note ?? '',
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
    this.vehicleService
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
    this.selectedVehicle = rows.length ? (rows[0] as VehicleDto) : null;
  }

  onRowDataUpdated(): void {}

  openNew(): void {
    this.isNew = true;
    this.itemForEdit = null;
    this.showModal = true;
  }

  openEdit(): void {
    if (!this.selectedVehicle?.id) return;
    this.isNew = false;
    this.itemForEdit = this.selectedVehicle;
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
    if (!this.selectedVehicle?.id) return;
    const label = this.selectedVehicle.model?.name
      ? `${this.selectedVehicle.model.name} ${this.selectedVehicle.yearFrom || ''}-${this.selectedVehicle.yearTo || ''}`
      : this.selectedVehicle.id;
    if (
      !confirm(this.translateService.instant('DeleteVehicle', { name: label }))
    )
      return;
    this.vehicleService.delete(String(this.selectedVehicle.id)).subscribe({
      next: () => {
        this.selectedVehicle = null;
        this.getList();
      },
    });
  }
}
