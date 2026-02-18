import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { LayoutComponent } from '../components/general-components/layout/layout.component';
import { PlaceholderPageComponent } from '../components/pages/placeholder-page.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { CategoriesComponent } from '../components/categories/categories.component';
import { ManufacturersComponent } from '../components/manufacturers/manufacturers.component';
import { SuppliersComponent } from '../components/suppliers/suppliers.component';
import { VehicleBrandsComponent } from '../components/vehicle-brands/vehicle-brands.component';
import { VehicleModelsComponent } from '../components/vehicle-models/vehicle-models.component';
import { VehiclesComponent } from '../components/vehicles/vehicles.component';
import { SystemUsersComponent } from '../components/system-users/system-users.component';
import { ClientsComponent } from '../components/clients/clients.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard' },
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        data: { title: 'Categories' },
      },
      {
        path: 'manufacturers',
        component: ManufacturersComponent,
        data: { title: 'Manufacturers' },
      },
      {
        path: 'suppliers',
        component: SuppliersComponent,
        data: { title: 'Suppliers' },
      },
      {
        path: 'vehicle-brands',
        component: VehicleBrandsComponent,
        data: { title: 'VehicleBrands' },
      },
      {
        path: 'vehicle-models',
        component: VehicleModelsComponent,
        data: { title: 'VehicleModels' },
      },
      {
        path: 'vehicles',
        component: VehiclesComponent,
        data: { title: 'Vehicles' },
      },
      {
        path: 'system-users',
        component: SystemUsersComponent,
        data: { title: 'SystemUsers' },
      },
      {
        path: 'products',
        component: PlaceholderPageComponent,
        data: { title: 'Products' },
      },
      {
        path: 'clients',
        component: ClientsComponent,
        data: { title: 'Clients' },
      },
      {
        path: 'warehouse',
        component: PlaceholderPageComponent,
        data: { title: 'Warehouse' },
      },
      {
        path: 'sales',
        component: PlaceholderPageComponent,
        data: { title: 'Sales' },
      },
      {
        path: 'reports',
        component: PlaceholderPageComponent,
        data: { title: 'Reports' },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
