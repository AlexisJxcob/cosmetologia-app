import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
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
  readonly selectedDate = signal<string>(new Date().toISOString().slice(0, 10));
  readonly statusLabel = STATUS_LABEL;
  readonly statusClass = STATUS_CLASS;

  // httpResource maneja automáticamente isLoading, error y value
  readonly appointments = httpResource<AppointmentDto[]>(() => `/api/appointments?fecha=${this.selectedDate()}`);

  onDateChange(value: string): void {
    this.selectedDate.set(value);
  }
}
