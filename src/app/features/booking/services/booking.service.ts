import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  AvailableSlotDto,
  CreateAppointmentRequest,
  AppointmentDto,
  ServiceDto,
} from '../../../core/models/dtos';

/**
 * Estado del wizard de reserva completo. Vive en un servicio (no en el
 * componente shell) para que cada step pueda leer/escribir su parte sin
 * pasar @Input/@Output en cascada por 4 niveles de componentes.
 */
export interface BookingDraft {
  service: ServiceDto | null;
  slot: AvailableSlotDto | null;
  client: CreateAppointmentRequest['client'] | null;
  notas: string;
}

const EMPTY_DRAFT: BookingDraft = { service: null, slot: null, client: null, notas: '' };

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly http = inject(HttpClient);

  private readonly _draft = signal<BookingDraft>(EMPTY_DRAFT);
  readonly draft = this._draft.asReadonly();

  getServices(): Promise<ServiceDto[]> {
    return firstValueFrom(this.http.get<ServiceDto[]>('/api/services'));
  }

  getAvailableSlots(serviceId: string, fecha: string): Promise<AvailableSlotDto[]> {
    // El backend calcula los slots ya descontando bufferMinutosAntes/Despues
    // configurados por servicio y los turnos ya ocupados ese día.
    return firstValueFrom(
      this.http.get<AvailableSlotDto[]>('/api/appointments/available-slots', {
        params: { serviceId, fecha },
      })
    );
  }

  confirm(): Promise<AppointmentDto> {
    const draft = this._draft();
    if (!draft.service || !draft.slot || !draft.client) {
      return Promise.reject(new Error('El borrador de reserva está incompleto.'));
    }

    const payload: CreateAppointmentRequest = {
      serviceId: draft.service.id,
      fechaHoraInicio: draft.slot.fechaHoraInicio,
      client: draft.client,
      notas: draft.notas || undefined,
    };

    return firstValueFrom(this.http.post<AppointmentDto>('/api/appointments', payload));
  }

  setService(service: ServiceDto): void {
    this._draft.update((d) => ({ ...d, service }));
  }

  setSlot(slot: AvailableSlotDto): void {
    this._draft.update((d) => ({ ...d, slot }));
  }

  setClient(client: BookingDraft['client']): void {
    this._draft.update((d) => ({ ...d, client }));
  }

  setNotas(notas: string): void {
    this._draft.update((d) => ({ ...d, notas }));
  }

  reset(): void {
    this._draft.set(EMPTY_DRAFT);
  }
}
