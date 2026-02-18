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
import { VehicleModelService } from '../../core/services/vehicle-model.service';
import { PaginationReturnDto } from '../../core/models/general/pagination-return-dto';
import { VehicleModelDto } from '../../core/models/vehicle-model/vehicle-model-dto';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from '../general-components/popup/popup.component';
import { NewVehicleModelComponent } from './new-vehicle-model/new-vehicle-model.component';
import { EditVehicleModelComponent } from './edit-vehicle-model/edit-vehicle-model.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicle-models',
  standalone: true,
  imports: [
    AgGridListComponent,
    PaginationComponent,
    PopupComponent,
    NewVehicleModelComponent,
    EditVehicleModelComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './vehicle-models.component.html',
  styleUrl: './vehicle-models.component.scss',
})
export class VehicleModelsComponent implements OnInit {
  page = 1;
  pageView = 20;
  query = '';
  searchInput = '';
  private searchSubject = new Subject<string>();
  paginationInfo: PaginationReturnDto | null = null;

  selectedModel: VehicleModelDto | null = null;
  public domLayout: DomLayoutType = 'autoHeight';
  protected gridApi!: GridApi;

  colDefs: ColDef[] = [];
  gridOptions: GridOptions = { suppressCellFocus: true };
  rowData: any[] = [];
  public rowSelection: RowSelectionOptions | 'single' | 'multiple' = { mode: 'singleRow' };
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
  itemForEdit: VehicleModelDto | null = null;

  constructor(
    private vehicleModelService: VehicleModelService,
    private translateService: TranslateService,
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
        field: 'brand',
        headerName: this.translateService.instant('VehicleBrand'),
        valueGetter: (params) => params.data?.brand?.name ?? '',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'name',
        headerName: this.translateService.instant('Name'),
        flex: 1,
        minWidth: 150,
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
    this.vehicleModelService
      .getList({ search: this.query, viewSize: this.pageView, pageNumber: this.page })
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
    const endItem = Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems);
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
    this.selectedModel = rows.length ? (rows[0] as VehicleModelDto) : null;
  }

  onRowDataUpdated(): void {}

  openNew(): void {
    this.isNew = true;
    this.itemForEdit = null;
    this.showModal = true;
  }

  openEdit(): void {
    if (!this.selectedModel?.id) return;
    this.isNew = false;
    this.itemForEdit = this.selectedModel;
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
    if (!this.selectedModel?.id) return;
    if (!confirm(this.translateService.instant('DeleteVehicleModel', { name: this.selectedModel.name }))) return;
    this.vehicleModelService.delete(String(this.selectedModel.id)).subscribe({
      next: () => {
        this.selectedModel = null;
        this.getList();
      },
    });
  }
}
