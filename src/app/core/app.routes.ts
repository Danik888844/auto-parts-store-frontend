import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { LayoutComponent } from '../components/general-components/layout/layout.component';
import { PlaceholderPageComponent } from '../components/pages/placeholder-page.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

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
        path: 'products',
        component: PlaceholderPageComponent,
        data: { title: 'Products' },
      },
      {
        path: 'clients',
        component: PlaceholderPageComponent,
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
