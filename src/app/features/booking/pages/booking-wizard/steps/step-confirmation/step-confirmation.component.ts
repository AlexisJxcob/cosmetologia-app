import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BookingService } from '@features/booking/services/booking.service';
import { ConfigService } from '@core/services/config.service';
import { AppointmentDto } from '@core/models/dtos';
import { FeatureFlagDirective } from '@shared/directives/feature-flag.directive';

@Component({
  selector: 'app-step-confirmation',
  standalone: true,
  imports: [DatePipe, FeatureFlagDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-confirmation.component.html',
  styleUrl: './step-confirmation.component.scss',
})
export class StepConfirmationComponent {
  private readonly bookingService = inject(BookingService);
  private readonly configService = inject(ConfigService);

  readonly draft = this.bookingService.draft;
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly appointment = signal<AppointmentDto | null>(null);

  readonly nombreGabinete = computed(
    () => this.configService.config()?.nombreGabinete ?? 'Gabinete Luxe'
  );

  readonly googleCalendarUrl = computed(() => {
    const appt = this.appointment();
    if (!appt) return null;

    const start = appt.fechaHoraInicio.replace(/[-:]/g, '').split('.')[0];
    const end = appt.fechaHoraFin.replace(/[-:]/g, '').split('.')[0];
    const text = encodeURIComponent(`${appt.service.nombre} — ${this.nombreGabinete()}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}`;
  });

  readonly whatsappUrl = computed(() => {
    const appt = this.appointment();
    if (!appt) return null;

    const mensaje = encodeURIComponent(
      `Hola! Quería confirmar mi turno de ${appt.service.nombre} el ${appt.fechaHoraInicio}.`
    );
    return `https://wa.me/?text=${mensaje}`;
  });

  async confirm(): Promise<void> {
    this.submitting.set(true);
    this.errorMessage.set(null);

    try {
      const appointment = await this.bookingService.confirm();
      this.appointment.set(appointment);
    } catch {
      this.errorMessage.set('No pudimos confirmar tu turno. Probá de nuevo en un momento.');
    } finally {
      this.submitting.set(false);
    }
  }
}
