import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from './models';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.user();
  const allowed = (route.data?.['roles'] as Role[] | undefined) ?? [];

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (allowed.length === 0 || allowed.includes(user.role)) {
    return true;
  }

  return router.createUrlTree(['/']);
};
