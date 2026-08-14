import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { FeatureFlagDirective } from '@shared/directives/feature-flag.directive';
import { DashboardKpiDto } from '@core/models/dtos';

interface NavItem {
  label: string;
  path: string;
  icon: string; // path SVG lineal, ver template
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Resumen', path: '/admin/overview', icon: 'M4 6h16M4 12h16M4 18h7' },
  {
    label: 'Agenda',
    path: '/admin/agenda',
    icon: 'M8 7V3m8 4V3M4 11h16M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z',
  },
  {
    label: 'Clientas',
    path: '/admin/clients',
    icon: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14c-4.4 0-8 2-8 5v1h16v-1c0-3-3.6-5-8-5Z',
  },
];

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CurrencyPipe, DecimalPipe, FeatureFlagDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  private readonly http = inject(HttpClient);
  readonly auth = inject(AuthService);

  readonly navItems = NAV_ITEMS;

  // `resource` maneja loading/error/valor sin RxJS manual, ideal para datos
  // de solo-lectura que se piden una vez al entrar al layout.
  readonly kpis = resource<DashboardKpiDto, unknown>({
    loader: () => this.http.get<DashboardKpiDto>('/api/dashboard/kpis') as unknown as Promise<DashboardKpiDto>,
  });

  logout(): void {
    this.auth.logout();
  }
}
