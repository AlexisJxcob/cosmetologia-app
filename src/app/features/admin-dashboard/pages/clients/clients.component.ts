import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ClientDto } from '@core/models/dtos';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);

  readonly clients = resource<ClientDto[], unknown>({
    loader: () => this.http.get<ClientDto[]>('/api/clients') as unknown as Promise<ClientDto[]>,
  });

  readonly selectedClient = signal<ClientDto | null>(null);
  readonly saving = signal(false);
  readonly saved = signal(false);

  readonly fichaForm = this.fb.nonNullable.group({
    tipoDePiel: [''],
    alergias: [''],
    historialTratamientos: [''],
    notasPrivadas: [''],
  });

  selectClient(client: ClientDto): void {
    this.selectedClient.set(client);
    this.saved.set(false);
    this.fichaForm.reset({
      tipoDePiel: client.fichaTecnica?.tipoDePiel ?? '',
      alergias: client.fichaTecnica?.alergias ?? '',
      historialTratamientos: client.fichaTecnica?.historialTratamientos ?? '',
      notasPrivadas: client.fichaTecnica?.notasPrivadas ?? '',
    });
  }

  async saveFicha(): Promise<void> {
    const client = this.selectedClient();
    if (!client) return;

    this.saving.set(true);
    this.saved.set(false);

    try {
      await firstValueFrom(
        this.http.put(`/api/clients/${client.id}/ficha-tecnica`, this.fichaForm.getRawValue())
      );
      this.saved.set(true);
    } finally {
      this.saving.set(false);
    }
  }
}
