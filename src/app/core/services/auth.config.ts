import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AdminUserDto, LoginRequest, LoginResponse } from '../models/dtos';

const TOKEN_KEY = 'gabinete_luxe_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _currentUser = signal<AdminUserDto | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  async login(credentials: LoginRequest): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>('/api/auth/login', credentials)
    );
    this.persistSession(response);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._currentUser.set(null);
    this.router.navigateByUrl('/admin/login');
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /** Se llama en el bootstrap para restaurar sesión si el token sigue vigente. */
  async restoreSession(): Promise<void> {
    const token = this.getToken();
    if (!token) return;

    try {
      const usuario = await firstValueFrom(this.http.get<AdminUserDto>('/api/auth/me'));
      this._currentUser.set(usuario);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  private persistSession(response: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, response.accessToken);
    this._currentUser.set(response.usuario);
  }
}
