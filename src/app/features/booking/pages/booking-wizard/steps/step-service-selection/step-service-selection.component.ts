import { ChangeDetectionStrategy, Component, inject, output, resource } from '@angular/core';
import { ServiceCardComponent } from '@shared/components/service-card/service-card.component';
import { BookingService } from '@features/booking/services/booking.service';
import { ServiceDto } from '@core/models/dtos';

/**
 * Paso 1: "qué servicio querés". Reutiliza ServiceCardComponent tal cual se
 * usa en el módulo público de presentación de servicios — misma tarjeta,
 * mismo lenguaje visual, ahora dentro del flujo de reserva.
 */
@Component({
  selector: 'app-step-service-selection',
  standalone: true,
  imports: [ServiceCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-service-selection.component.html',
  styleUrl: './step-service-selection.component.scss',
})
export class StepServiceSelectionComponent {
  private readonly bookingService = inject(BookingService);

  readonly next = output<void>();

  readonly services = resource<ServiceDto[], unknown>({
    loader: () => this.bookingService.getServices(),
  });

  onSelect(service: ServiceDto): void {
    this.bookingService.setService(service);
    this.next.emit();
  }
}
