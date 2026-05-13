import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.isLoggedIn()) return true;
  return inject(Router).createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.isLoggedIn() && auth.isAdmin()) return true;
  return inject(Router).createUrlTree(['/form']);
};

export const tiOrAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.isLoggedIn() && (auth.isAdmin() || auth.getDepartment() === 'TI')) return true;
  return inject(Router).createUrlTree(['/form']);
};

export const tiGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.isLoggedIn() && auth.getDepartment().toUpperCase() === 'TI') return true;
  return inject(Router).createUrlTree(['/form']);
};
