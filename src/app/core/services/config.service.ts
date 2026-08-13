import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TenantConfigDto } from '../models/dtos';

const DEFAULT_ACCENT = '#5C6B54';

/**
 * Config multi-cliente: cada gabinete (tenant) tiene su propio color de marca
 * y su propio set de feature flags. Se resuelve una vez al bootstrapear la
 * app (ver app.config.ts -> provideAppInitializer) para que no haya "flash"
 * de color por defecto antes de pintar la UI real.
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly http = inject(HttpClient);

  private readonly _config = signal<TenantConfigDto | null>(null);
  readonly config = this._config.asReadonly();

  async load(tenantId: string): Promise<void> {
    const config = await firstValueFrom(
      this.http.get<TenantConfigDto>(`/api/tenants/${tenantId}/config`)
    );
    this._config.set(config);
    this.applyBranding(config.colorAcento);
  }

  /** Feature flag lookup usado por la directiva estructural *appFeatureFlag. */
  isEnabled(flag: keyof TenantConfigDto['featureFlags']): boolean {
    return this._config()?.featureFlags?.[flag] ?? false;
  }

  private applyBranding(colorAcento: string | undefined): void {
    const accent = colorAcento || DEFAULT_ACCENT;
    document.documentElement.style.setProperty('--color-accent', accent);
    document.documentElement.style.setProperty('--color-accent-soft', this.softenHex(accent, 0.14));
    document.documentElement.style.setProperty('--color-accent-ink', this.darkenHex(accent, 0.25));
  }

  // Utilitarios mínimos para derivar variantes del acento sin depender de una
  // librería de color; el backend solo entrega un hex base por tenant.
  private softenHex(hex: string, alpha: number): string {
    const { r, g, b } = this.toRgb(hex);
    const mix = (c: number) => Math.round(c + (250 - c) * (1 - alpha));
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  }

  private darkenHex(hex: string, amount: number): string {
    const { r, g, b } = this.toRgb(hex);
    const mix = (c: number) => Math.round(c * (1 - amount));
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  }

  private toRgb(hex: string): { r: number; g: number; b: number } {
    const clean = hex.replace('#', '');
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }
}
