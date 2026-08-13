import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { StepDatetimeComponent } from '@features/booking/pages/booking-wizard/steps/step-datetime/step-datetime.component';
// import { StepServiceSelectionComponent } from './steps/step-service-selection/...';
// import { StepClientInfoComponent } from './steps/step-client-info/...';
// import { StepConfirmationComponent } from './steps/step-confirmation/...';

type WizardStep = 'servicio' | 'fecha' | 'datos' | 'confirmacion';
const STEPS: WizardStep[] = ['servicio', 'fecha', 'datos', 'confirmacion'];

@Component({
  selector: 'app-booking-wizard',
  standalone: true,
  imports: [StepDatetimeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-3xl px-6 pt-8">
      <!-- Firma visual: un único hilo de 2px, no una barra de pasos numerados -->
      <div class="progress-thread" role="progressbar" [attr.aria-valuenow]="progressPct()" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-thread__fill" [style.width.%]="progressPct()"></div>
      </div>
    </div>

    @switch (currentStep()) {
      @case ('fecha') {
        <app-step-datetime (next)="goToStep('datos')" />
      }
      @default {
        <!-- Los demás steps (servicio, datos, confirmación) siguen el mismo
             patrón que step-datetime: standalone, leen/escriben BookingService. -->
      }
    }
  `,
})
export class BookingWizardComponent {
  readonly currentStep = signal<WizardStep>('fecha');

  readonly progressPct = computed(() => {
    const index = STEPS.indexOf(this.currentStep());
    return ((index + 1) / STEPS.length) * 100;
  });

  goToStep(step: WizardStep): void {
    this.currentStep.set(step);
  }
}
