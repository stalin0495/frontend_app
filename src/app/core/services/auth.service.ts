// src/app/core/services/auth.service.ts

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IApiResponse } from '../../shared/interfaces/response.interface'; // Alineado con el Response Wrapper
import { environment } from '../../../environments/environment';

interface ILoginResponseData {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = `${environment.apiUrl}/auth`;
  private TOKEN_KEY = 'access_token';
  private readonly isBrowser: boolean;

  // Flujo reactivo interno del estado de autenticación (Única fuente de verdad en UI)
  private currentUserSubject = new BehaviorSubject<any | null>(null);
  public currentUser$: Observable<any | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.currentUserSubject.next(this.getUserFromStorage());
  }

  /**
   * Ejecuta el login transaccional contra el backend modular.
   * Almacena el JWT mediante efectos secundarios controlados (tap).
   */
  login(credentials: { email: string; password: string }): Observable<ILoginResponseData> {
    return this.http.post<IApiResponse<ILoginResponseData>>(`${this.API_URL}/login`, credentials).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data; // Desempaqueta la envoltura estándar del Backend
        }
        throw new Error(response.error?.message || 'Fallo de autenticación estructural.');
      }),
      tap(data => {
        // Almacenamiento seguro del token
        if (this.isBrowser) {
          localStorage.setItem(this.TOKEN_KEY, data.token);
        }
        // Emisión reactiva del nuevo estado del usuario para toda la app
        this.currentUserSubject.next(data.user);
      }),
      catchError((err: HttpErrorResponse | Error) => throwError(() => new Error(this.getFriendlyAuthError(err))))
    );
  }

  /**
   * Traduce errores de red/HTTP crudos en mensajes semánticos aptos para mostrar al usuario final.
   */
  private getFriendlyAuthError(err: HttpErrorResponse | Error): string {
    if (err instanceof HttpErrorResponse) {
      const backendMessage = err.error?.error?.message;
      if (backendMessage) return backendMessage;
      if (err.status === 401) return 'Correo electrónico o contraseña incorrectos.';
      if (err.status === 0) return 'No fue posible conectar con el servidor. Verifica tu conexión e inténtalo nuevamente.';
      return 'Ocurrió un error inesperado al procesar tu solicitud. Inténtalo más tarde.';
    }
    return err.message || 'Ocurrió un error inesperado al procesar tu solicitud. Inténtalo más tarde.';
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.currentUserSubject.next(null);
  }

  public getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  private getUserFromStorage(): any | null {
    // Si necesitas persistir datos básicos del usuario (rol, email) al recargar la página
    if (!this.isBrowser) {
      return null;
    }
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token ? { rol: 'alumno' } : null; // Lógica simplificada o parseo de Claims JWT
  }
}
