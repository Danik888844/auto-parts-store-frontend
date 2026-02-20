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
import { VehicleBrandService } from '../../core/services/vehicle-brand.service';
import { PaginationReturnDto } from '../../core/models/general/pagination-return-dto';
import { VehicleBrandDto } from '../../core/models/vehicle-brand/vehicle-brand-dto';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from '../general-components/popup/popup.component';
import { NewVehicleBrandComponent } from './new-vehicle-brand/new-vehicle-brand.component';
import { EditVehicleBrandComponent } from './edit-vehicle-brand/edit-vehicle-brand.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicle-brands',
  standalone: true,
  imports: [
    AgGridListComponent,
    PaginationComponent,
    PopupComponent,
    NewVehicleBrandComponent,
    EditVehicleBrandComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './vehicle-brands.component.html',
  styleUrl: './vehicle-brands.component.scss',
})
export class VehicleBrandsComponent implements OnInit {
  page = 1;
  pageView = 20;
  query = '';
  searchInput = '';
  private searchSubject = new Subject<string>();
  paginationInfo: PaginationReturnDto | null = null;

  selectedBrand: VehicleBrandDto | null = null;
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
  itemForEdit: VehicleBrandDto | null = null;

  constructor(
    private vehicleBrandService: VehicleBrandService,
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
    ];
  }

  ngOnInit(): void {
    this.getList();
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchInput.trim());
  }

  getList(): void {
    this.vehicleBrandService
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
    this.selectedBrand = rows.length ? (rows[0] as VehicleBrandDto) : null;
  }

  onRowDataUpdated(): void {}

  openNew(): void {
    this.isNew = true;
    this.itemForEdit = null;
    this.showModal = true;
  }

  openEdit(): void {
    if (!this.selectedBrand?.id) return;
    this.isNew = false;
    this.itemForEdit = this.selectedBrand;
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
    if (!this.selectedBrand?.id) return;
    if (
      !confirm(
        this.translateService.instant('DeleteVehicleBrand', {
          name: this.selectedBrand.name,
        }),
      )
    )
      return;
    this.vehicleBrandService.delete(String(this.selectedBrand.id)).subscribe({
      next: () => {
        this.selectedBrand = null;
        this.getList();
      },
    });
  }
}
