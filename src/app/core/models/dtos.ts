/**
 * DTOs alineados 1:1 con los records/entidades expuestas por el backend
 * Spring Boot (com.gabineteluxe.api.dto.*). Mantener este archivo sincronizado
 * con el contrato OpenAPI del backend; cualquier campo opcional en Java
 * (@Nullable / Optional<T>) se modela acá con `?`.
 */

export type ServiceCategory = 'FACIAL' | 'CORPORAL' | 'MASAJES' | 'DEPILACION' | 'MANICURA';

export interface ServiceDto {
  id: string; // UUID
  nombre: string;
  descripcionBreve: string;
  duracionMinutos: number;
  precio: number; // BigDecimal en backend -> number en el front
  categoria: ServiceCategory;
  imagenUrl?: string;
  activo: boolean;
}

export type AppointmentStatus = 'PENDIENTE' | 'CONFIRMADO' | 'COMPLETADO' | 'CANCELADO';

export interface ClientDto {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  // Ficha técnica: historial clínico/estético del cliente
  fichaTecnica?: ClientTechnicalRecordDto;
}

export interface ClientTechnicalRecordDto {
  tipoDePiel?: string;
  alergias?: string;
  historialTratamientos?: string;
  notasPrivadas?: string; // solo visible para el staff, nunca al cliente
  actualizadoEn?: string; // ISO-8601
}

export interface AppointmentDto {
  id: string;
  service: ServiceDto;
  client: ClientDto;
  fechaHoraInicio: string; // ISO-8601, ej. "2026-08-20T15:30:00"
  fechaHoraFin: string; // calculado en backend: inicio + duración + bufferMinutos
  estado: AppointmentStatus;
  bufferMinutosAntes: number;
  bufferMinutosDespues: number;
  notas?: string;
  creadoEn: string;
}

/** Payload para crear un turno desde el wizard público. */
export interface CreateAppointmentRequest {
  serviceId: string;
  fechaHoraInicio: string;
  client: {
    nombreCompleto: string;
    email: string;
    telefono: string;
  };
  notas?: string;
}

/** Slots disponibles calculados por el backend (ya descuenta buffers y turnos ocupados). */
export interface AvailableSlotDto {
  fechaHoraInicio: string;
  fechaHoraFin: string;
}

export interface DashboardKpiDto {
  turnosHoy: number;
  ingresosEstimadosMes: number;
  tasaOcupacionSemana: number; // 0..1
  turnosPendientesConfirmacion: number;
}

/* ---------- Autenticación ---------- */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  usuario: AdminUserDto;
}

export interface AdminUserDto {
  id: string;
  nombre: string;
  email: string;
  rol: 'DUENA' | 'RECEPCION';
  tenantId: string;
}

/* ---------- Configuración por cliente (feature flags + branding) ---------- */

export interface TenantConfigDto {
  tenantId: string;
  nombreGabinete: string;
  colorAcento: string; // hex, ej. "#5C6B54"
  featureFlags: {
    pagosOnline: boolean;
    integracionWhatsapp: boolean;
    integracionGoogleCalendar: boolean;
    listaDeEspera: boolean;
  };
}
