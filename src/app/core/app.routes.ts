import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { LayoutComponent } from '../components/general-components/layout/layout.component';
import { PlaceholderPageComponent } from '../components/pages/placeholder-page.component';
import { authGuard } from './guards/auth.guard';

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
        component: PlaceholderPageComponent,
        data: { title: 'Главная' },
      },
      {
        path: 'products',
        component: PlaceholderPageComponent,
        data: { title: 'Товары' },
      },
      {
        path: 'clients',
        component: PlaceholderPageComponent,
        data: { title: 'Клиенты' },
      },
      {
        path: 'warehouse',
        component: PlaceholderPageComponent,
        data: { title: 'Склад' },
      },
      {
        path: 'sales',
        component: PlaceholderPageComponent,
        data: { title: 'Продажи' },
      },
      {
        path: 'reports',
        component: PlaceholderPageComponent,
        data: { title: 'Отчеты' },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
