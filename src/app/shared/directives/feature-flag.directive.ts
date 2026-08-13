import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { ConfigService } from '../../core/services/config.service';
import { TenantConfigDto } from '../../core/models/dtos';

/**
 * Uso: <div *appFeatureFlag="'integracionWhatsapp'">...</div>
 * Muestra/oculta un bloque de UI según el feature flag del tenant actual,
 * reaccionando en vivo si ConfigService.config cambia.
 */
@Directive({
  selector: '[appFeatureFlag]',
  standalone: true,
})
export class FeatureFlagDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly configService = inject(ConfigService);

  private flag?: keyof TenantConfigDto['featureFlags'];
  private hasView = false;

  constructor() {
    effect(() => {
      // Se re-evalúa automáticamente porque ConfigService.config es un signal.
      this.configService.config();
      this.updateView();
    });
  }

  @Input() set appFeatureFlag(flag: keyof TenantConfigDto['featureFlags']) {
    this.flag = flag;
    this.updateView();
  }

  private updateView(): void {
    if (!this.flag) return;
    const shouldShow = this.configService.isEnabled(this.flag);

    if (shouldShow && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!shouldShow && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
