import { ChangeDetectionStrategy, Component, computed, effect, inject, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BookingService } from '../../../../services/booking.service';
import { AvailableSlotDto } from '../../../../../../core/models/dtos';

/**
 * Paso del wizard: "elegir día y hora". Sigue la regla de una sola decisión
 * por pantalla — primero se elige el día (chips horizontales), y recién ahí
 * aparecen los horarios disponibles de ese día. Nada compite por atención.
 */
@Component({
  selector: 'app-step-datetime',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-datetime.component.html',
  styleUrl: './step-datetime.component.scss',
})
export class StepDatetimeComponent {
  private readonly bookingService = inject(BookingService);

  readonly next = output<void>();

  readonly availableDays = this.buildNextDays(7);
  readonly selectedDay = signal<Date>(this.availableDays[0]);
  readonly slots = signal<AvailableSlotDto[]>([]);
  readonly selectedSlot = signal<AvailableSlotDto | null>(null);
  readonly loading = signal(false);

  readonly canContinue = computed(() => this.selectedSlot() !== null);

  constructor() {
    // Cada vez que cambia el día seleccionado (o el servicio elegido en el
    // paso anterior), se vuelven a pedir los horarios disponibles al backend.
    effect(() => {
      const day = this.selectedDay();
      const service = this.bookingService.draft().service;
      if (!service) return;

      this.loading.set(true);
      this.selectedSlot.set(null);

      this.bookingService
        .getAvailableSlots(service.id, day.toISOString().slice(0, 10))
        .then((slots) => this.slots.set(slots))
        .finally(() => this.loading.set(false));
    });
  }

  selectDay(day: Date): void {
    this.selectedDay.set(day);
  }

  selectSlot(slot: AvailableSlotDto): void {
    this.selectedSlot.set(slot);
  }

  continue(): void {
    const slot = this.selectedSlot();
    if (!slot) return;
    this.bookingService.setSlot(slot);
    this.next.emit();
  }

  private buildNextDays(count: number): Date[] {
    return Array.from({ length: count }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
  }
}
