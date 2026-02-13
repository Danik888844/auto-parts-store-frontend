import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { LayoutComponent } from '../components/general-components/layout/layout.component';

export const routes: Routes = [ 
{ path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: LoginComponent,
      }, 
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
