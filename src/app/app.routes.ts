import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/booking/booking.routes').then(m => m.BOOKING_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
