import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/admin-dashboard/layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('@features/admin-dashboard/pages/overview/overview.component').then(
            (m) => m.OverviewComponent
          ),
      },
      {
        path: 'agenda',
        loadComponent: () =>
          import('@features/admin-dashboard/pages/agenda/agenda.component').then(
            (m) => m.AgendaComponent
          ),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('@features/admin-dashboard/pages/clients/clients.component').then(
            (m) => m.ClientsComponent
          ),
      },
    ],
  },
];
