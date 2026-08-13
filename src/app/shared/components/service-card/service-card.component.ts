import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ServiceDto } from '../../../core/models/dtos';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss',
})
export class ServiceCardComponent {
  // Signal-based inputs (Angular 17.1+): sin @Input(), sin decoradores extra.
  service = input.required<ServiceDto>();

  select = output<ServiceDto>();

  onSelect(): void {
    this.select.emit(this.service());
  }
}
