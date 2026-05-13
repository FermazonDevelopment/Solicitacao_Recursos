import { Routes } from '@angular/router';
import { authGuard, adminGuard, tiGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'form',      loadComponent: () => import('./pages/form/form.component').then(m => m.FormComponent) },
      { path: 'panel',     loadComponent: () => import('./pages/panel/panel.component').then(m => m.PanelComponent) },
      { path: 'dashboard',        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),       canActivate: [adminGuard] },
      { path: 'password-request', loadComponent: () => import('./pages/password-request/password-request.component').then(m => m.PasswordRequestComponent) },
      { path: 'admin-passwords',  loadComponent: () => import('./pages/admin-passwords/admin-passwords.component').then(m => m.AdminPasswordsComponent),  canActivate: [tiGuard] },
      { path: 'admin-users',      loadComponent: () => import('./pages/admin-users/admin-users.component').then(m => m.AdminUsersComponent),                canActivate: [tiGuard] },
      { path: '', redirectTo: 'form', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
