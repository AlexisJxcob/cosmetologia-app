import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.config';

/**
 * Protege todo lo que cuelgue de /admin. Si no hay sesión restaurada
 * (ver AuthService.restoreSession en el bootstrap), redirige al login
 * en vez de dejar pasar y fallar más adelante contra la API.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  router.navigateByUrl('/admin/login');
  return false;
};
