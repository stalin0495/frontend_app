// src/app/features/auth/login-dashboard.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-dashboard',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <!-- Alerta de Errores Semánticos atrapados por el wrapper -->
          <div *ngIf="errorMessage" class="alert alert-danger py-2 shadow-sm">
            {{ errorMessage }}
          </div>

          <!-- Confirmación visual de autenticación exitosa antes de redirigir -->
          <div *ngIf="successMessage" class="alert alert-success py-2 shadow-sm">
            {{ successMessage }}
          </div>

          <!-- Componente de Presentación Pura (Dumb) -->
          <app-login-form
            [isLoading]="loading"
            (submitLogin)="onExecuteLogin($event)">
          </app-login-form>
        </div>
      </div>
    </div>
  `
})
export class LoginDashboardComponent {
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onExecuteLogin(credentials: any): void {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Inicio de sesión exitoso. Redirigiendo...';
        // Pequeña pausa para que el usuario vea la confirmación antes de redirigir
        setTimeout(() => this.router.navigate(['/employees']), 1200);
      },
      error: (err) => {
        this.loading = false;
        // Captura el mensaje formateado del validador global de errores
        this.errorMessage = err.message || 'Error de infraestructura al validar credenciales.';
      }
    });
  }
}
