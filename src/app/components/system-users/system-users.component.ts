import { Component, OnInit } from '@angular/core';
import {
  ColDef,
  GridApi,
  GridOptions,
  RowSelectionOptions,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { UserService } from '../../core/services/user.service';
import { UserDto } from '../../core/models/users/user-dto';
import { AgGridListComponent } from '../general-components/ag-grid-list/ag-grid-list.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from '../general-components/popup/popup.component';
import { ChangeUserRolePopupComponent } from './change-user-role-popup/change-user-role-popup.component';
import { ChangeRoleCellRendererComponent } from './change-role-cell-renderer/change-role-cell-renderer.component';
import { ChangeRoleContext } from './change-role-cell-renderer/change-role-cell-renderer.component';
import { NewUserComponent } from './new-user/new-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import {
  PaginationComponent,
  PaginationInfo,
} from '../general-components/pagination/pagination.component';
import { LoadingComponent } from '../general-components/loading/loading.component';
import { NotificationService } from '../../core/services/helpers/notification.service';
import { PaginationReturnDto } from '../../core/models/general/pagination-return-dto';

@Component({
  selector: 'app-system-users',
  standalone: true,
  imports: [
    AgGridListComponent,
    ChangeRoleCellRendererComponent,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    PopupComponent,
    ChangeUserRolePopupComponent,
    NewUserComponent,
    EditUserComponent,
    LoadingComponent,
    PaginationComponent,
  ],
  templateUrl: './system-users.component.html',
  styleUrl: './system-users.component.scss',
})
export class SystemUsersComponent implements OnInit {
  page = 1;
  pageView = 20;
  paginationInfo: PaginationReturnDto | null = null;

  users: UserDto[] = [];
  isLoading = true;
  showChangeRolePopup = false;
  userForRoleChange: UserDto | null = null;
  showUserModal = false;
  isNewUser = true;
  userForEdit: UserDto | null = null;
  selectedUser: UserDto | null = null;
  protected gridApi!: GridApi;

  colDefs: ColDef<UserDto>[] = [];
  gridOptions: GridOptions = {
    suppressCellFocus: true,
  };
  rowData: UserDto[] = [];
  rowSelection: RowSelectionOptions = { mode: 'singleRow' };
  selectionColumnDef = {
    sortable: true,
    resizable: true,
    width: 50,
    maxWidth: 100,
    suppressHeaderMenuButton: false,
    pinned: 'left' as const,
  };

  contextForGrid: ChangeRoleContext;

  constructor(
    private userService: UserService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
  ) {
    this.contextForGrid = {
      openChangeRole: (user: UserDto) => this.openChangeRole(user),
    };
    this.colDefs = [
      {
        field: 'userName',
        headerName: this.translateService.instant('UserName'),
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 160,
      },
      {
        field: 'firstName',
        headerName: this.translateService.instant('FirstName'),
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'lastName',
        headerName: this.translateService.instant('LastName'),
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'phoneNumber',
        headerName: this.translateService.instant('PhoneNumber'),
        flex: 1,
        minWidth: 110,
        valueGetter: (params) => params.data?.phoneNumber ?? '—',
      },
      {
        field: 'isActive',
        headerName: this.translateService.instant('IsActive'),
        width: 90,
        valueGetter: (params) =>
          params.data?.isActive
            ? this.translateService.instant('Yes')
            : this.translateService.instant('No'),
      },
      {
        field: 'roles',
        headerName: this.translateService.instant('Roles'),
        flex: 1,
        minWidth: 120,
        valueGetter: (params) => (params.data?.roles ?? []).join(', ') || '—',
      },
      {
        headerName: '',
        width: 70,
        sortable: false,
        filter: false,
        cellRenderer: ChangeRoleCellRendererComponent,
      },
    ];
  }

  ngOnInit(): void {
    this.getList();
  }

  getList(): void {
    this.isLoading = true;
    this.userService
      .getUsers({
        viewSize: this.pageView,
        pageNumber: this.page,
      })
      .subscribe({
        next: (res) => {
          this.users = res.data.items ?? [];
          this.rowData = this.users;
          this.isLoading = false;
          this.paginationInfo = res.data.pagination;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  onGridReady(params: { api: GridApi }): void {
    this.gridApi = params.api;
  }

  onSelectionChanged(event: SelectionChangedEvent): void {
    const rows = event.api.getSelectedRows();
    this.selectedUser = rows.length ? (rows[0] as UserDto) : null;
  }

  openNewUser(): void {
    this.isNewUser = true;
    this.userForEdit = null;
    this.showUserModal = true;
  }

  openEditUser(): void {
    if (!this.selectedUser?.id) return;
    this.isNewUser = false;
    this.userForEdit = this.selectedUser;
    this.showUserModal = true;
  }

  closeUserPopup(): void {
    this.showUserModal = false;
    this.userForEdit = null;
  }

  onUserSaved(): void {
    this.showUserModal = false;
    this.userForEdit = null;
    if (this.isNewUser) this.page = 1;
    this.getList();
    this.notificationService.success(this.isNewUser ? 'UserCreated' : 'UserUpdated');
  }

  openChangeRole(user: UserDto): void {
    this.userForRoleChange = user;
    this.showChangeRolePopup = true;
  }

  closeChangeRolePopup(): void {
    this.showChangeRolePopup = false;
    this.userForRoleChange = null;
  }

  onRoleSaved(): void {
    this.closeChangeRolePopup();
    this.getList();
    this.notificationService.success('RoleChanged');
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
}
