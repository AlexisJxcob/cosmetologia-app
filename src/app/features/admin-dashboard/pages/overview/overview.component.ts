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

  // Tipamos como 'any' para evitar que 'as const' o las restricciones
  // estrictas de tipo 'Color' de ngx-charts bloqueen la compilación del HTML.
  readonly colorScheme: any = {
    domain: ['var(--color-accent)', 'var(--color-accent-soft)'],
  };
}
