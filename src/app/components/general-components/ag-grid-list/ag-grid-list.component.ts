import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ColDef,
  DomLayoutType,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowClickedEvent,
  RowDataUpdatedEvent,
  RowDragEndEvent,
  RowSelectedEvent,
  RowSelectionOptions,
  SelectionChangedEvent,
  SelectionColumnDef,
  StateUpdatedEvent,
} from 'ag-grid-community';
import { getLocaleText } from '../../../core/helpers/locale-ag-grid';
import { AgGridAngular } from 'ag-grid-angular';
import { NgIf, NgStyle } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-ag-grid-list',
  standalone: true,
  imports: [
    AgGridAngular,
    NgStyle,
    TranslateModule,
    NgIf,
    MatTooltip,
  ],
  templateUrl: './ag-grid-list.component.html',
  styleUrl: './ag-grid-list.component.scss',
})
export class AgGridListComponent implements OnChanges {
  @Input() colDefs!: ColDef[];
  @Input() public domLayout: DomLayoutType = 'autoHeight';
  @Input() gridOptions: GridOptions = {
    suppressCellFocus: true,
  };
  @Input() showInfoIcon = false;
  @Input() infoTooltip?: string;
  @Input() public rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
    mode: 'multiRow',
    selectAll: 'currentPage',
  };
  @Input() public selectionColumnDef: SelectionColumnDef = {
    sortable: true,
    resizable: true,
    width: 50,
    maxWidth: 100,
    suppressHeaderMenuButton: false,
    pinned: 'left',
    cellStyle: { display: 'flex', alignItems: 'center' },
  };
  @Input() public paginationPageSize = 20;
  @Input() public paginationPageSizeSelector: number[] | boolean = [
    20, 30, 40, 50,
  ];
  @Input() gridApi!: GridApi;
  @Input() public style: any = {
    width: '100%',
    height: '100%',
    flex: '1 1 auto',
  };
  @Input() rowData: any | undefined;
  @Input() getContext?: any;
  @Input() pagination: boolean = true;
  @Input() isRowSelectable: boolean = true;
  @Input() showSelectedNumber: boolean = false;
  @Input() rowDragManaged: boolean = false;
  @Input() suppressMoveWhenRowDragging: boolean = false;
  @Input() firstSelected: boolean | undefined;
  @Input() showColumnManager = true;
  @Input() getRowStyle?: any;
  @Input() getRowClass?: any;
  @Input() quickFilterText?: string;
  @Input() loading?: boolean;
  @Output() onRowDragEnd: EventEmitter<RowDragEndEvent> = new EventEmitter();
  @Output() onRowClick: EventEmitter<RowClickedEvent> = new EventEmitter();
  @Output() onGridReady: EventEmitter<any> = new EventEmitter();
  @Output() setHeaderTooltip: EventEmitter<any> = new EventEmitter();
  @Output() onSelectionChanged = new EventEmitter<SelectionChangedEvent>();
  @Output() openFirstSelected: EventEmitter<any> = new EventEmitter();
  @Output() onFirstDataRenderer = new EventEmitter<FirstDataRenderedEvent>();
  @Output() rowDataUpdated = new EventEmitter<RowDataUpdatedEvent>();
  @Output() onRowSelected = new EventEmitter<RowSelectedEvent>();
  @Output() onFilterChanged = new EventEmitter<any>();
  @Output() onSortChanged = new EventEmitter<any>();

  constructor(
    private translateService: TranslateService,
  ) {
    this.gridOptions = {
      suppressCellFocus: true,
      localeText: getLocaleText(this.translateService),
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['quickFilterText'] && !changes['quickFilterText'].firstChange) {
      this.gridApi?.setGridOption('quickFilterText', this.quickFilterText);
    }
    this.applyCellFlex();
  }

  applyCellFlex() {
    this.colDefs?.forEach((col) => {
      const origStyle = col.cellStyle;
      col.cellStyle = (params: any) => {
        const base =
          typeof origStyle === 'function' ? origStyle(params) : origStyle || {};
        return { ...base, display: 'flex', alignItems: 'center' };
      };
    });
  }

  onRowClickEvent(event: RowClickedEvent): void {
    const target = event.event?.target as HTMLElement | null;
    if (!target || !this.gridApi) return;

    if (target.closest('.ag-checkbox-input')) return;

    const cell = target.closest('.ag-cell');
    if (cell?.querySelector('.ag-checkbox-input, .ag-selection-checkbox')) {
      this.gridApi.setNodesSelected({
        nodes: [event.node],
        newValue: !event.node.isSelected(),
        source: 'checkboxSelected',
      });
      return;
    }
    this.onRowClick.emit(event);
  }

  onColumnMoved() {
    const columnState = this.gridApi!.getColumnState();

    this.colDefs = columnState
      .map((state: any) => {
        const colDef = this.colDefs.find((cd) => cd.field === state.colId);
        if (!colDef) {
          return null;
        }
        return {
          ...colDef,
          hide: !!state.hide,
          pinned: state.pinned ?? null,
        };
      })
      .filter(Boolean) as ColDef[];
  }

  onColumnVisible() {
    this.onColumnMoved();
  }

  onColumnsChange(updatedColumns: ColDef[]) {
    this.colDefs = updatedColumns;

    if (this.gridApi) {
      const columnState = updatedColumns
        .filter((col) => col.field)
        .map((col, index) => ({
          colId: col.field!,
          hide: col.hide || false,
          order: index,
        }));

      this.gridApi.applyColumnState({
        state: columnState,
        applyOrder: true,
      });
    }
  }

  onGridReadyEmit(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.onGridReady.emit(params);
    this.setHeaderTooltip.emit();
  }

  isSelectedAll() {
    return (
      this.gridApi?.getSelectedNodes()?.length ==
      this.gridApi?.paginationGetRowCount()
    );
  }

}
