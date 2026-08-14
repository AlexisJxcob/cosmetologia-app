import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';

interface OccupancyPoint {
  name: string;
  value: number;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [NgxChartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  private readonly http = inject(HttpClient);

  readonly occupancyByDay = resource<OccupancyPoint[], unknown>({
    loader: () =>
      this.http.get<OccupancyPoint[]>('/api/dashboard/occupancy-by-day') as unknown as Promise<
        OccupancyPoint[]
      >,
  });

  // Un solo tono (el acento del tenant) en dos opacidades, en vez de la
  // paleta arcoíris por defecto de ngx-charts — coherencia con el resto del
  // sistema de diseño, donde el color siempre es una sola voz.
  readonly colorScheme = {
    domain: ['var(--color-accent)', 'var(--color-accent-soft)'],
  } as const;
}
