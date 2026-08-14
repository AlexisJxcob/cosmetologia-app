import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AppointmentDto, AppointmentStatus } from '@core/models/dtos';

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado',
};

const STATUS_CLASS: Record<AppointmentStatus, string> = {
  PENDIENTE: 'badge-state--pending',
  CONFIRMADO: 'badge-state--confirmed',
  COMPLETADO: 'badge-state--completed',
  CANCELADO: 'badge-state--cancelled',
};

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss',
})
export class AgendaComponent {
  private readonly http = inject(HttpClient);

  readonly selectedDate = signal<string>(new Date().toISOString().slice(0, 10));
  readonly statusLabel = STATUS_LABEL;
  readonly statusClass = STATUS_CLASS;

  readonly appointments = resource<AppointmentDto[], { fecha: string }>({
    request: () => ({ fecha: this.selectedDate() }),
    loader: ({ request }) =>
      this.http.get<AppointmentDto[]>('/api/appointments', {
        params: request,
      }) as unknown as Promise<AppointmentDto[]>,
  });

  onDateChange(value: string): void {
    this.selectedDate.set(value);
  }
}
