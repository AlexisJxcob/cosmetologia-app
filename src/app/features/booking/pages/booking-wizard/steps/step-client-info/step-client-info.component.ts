import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '@features/booking/services/booking.service';

@Component({
  selector: 'app-step-client-info',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-client-info.component.html',
  styleUrl: './step-client-info.component.scss',
})
export class StepClientInfoComponent {
  private readonly fb = inject(FormBuilder);
  private readonly bookingService = inject(BookingService);

  readonly next = output<void>();
  readonly back = output<void>();

  readonly form = this.fb.nonNullable.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(8)]],
    notas: [''],
  });

  get nombreCompleto() {
    return this.form.controls.nombreCompleto;
  }

  get email() {
    return this.form.controls.email;
  }

  get telefono() {
    return this.form.controls.telefono;
  }

  continue(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nombreCompleto, email, telefono, notas } = this.form.getRawValue();
    this.bookingService.setClient({ nombreCompleto, email, telefono });
    this.bookingService.setNotas(notas);
    this.next.emit();
  }

  goBack(): void {
    this.back.emit();
  }
}
