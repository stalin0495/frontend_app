// src/app/features/auth/components/login-form/login-form.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html' // Archivo HTML limpio con enlaces bidireccionales locales
})
export class LoginFormComponent {
  @Input() isLoading = false;
  @Output() submitLogin = new EventEmitter<any>();

  // Estado temporal puramente local y aislado de la vista
  formModel = { email: '', password: '' };
  validationError: string | null = null;

  onSubmit(): void {
    if (!this.formModel.email || !this.formModel.password) {
      this.validationError = 'Debes ingresar tu correo y contraseña para continuar.';
      return;
    }
    this.validationError = null;
    // Notifica al padre el intento de inicio de sesión
    this.submitLogin.emit({ ...this.formModel });
  }
}
