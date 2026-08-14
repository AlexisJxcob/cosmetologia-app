import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.config';

/**
 * Solo adjunta el token a llamadas contra nuestra propia API (/api/**).
 * Esto evita mandar el Bearer token por accidente a servicios externos
 * como Google Calendar o WhatsApp, que se linkean directamente por URL.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  const isApiRequest = req.url.startsWith('/api');

  if (!token || !isApiRequest) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
