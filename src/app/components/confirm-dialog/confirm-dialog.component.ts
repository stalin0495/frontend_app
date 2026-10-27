import { Component, EventEmitter, Input, Output } from '@angular/core';

// Dumb Component: modal de confirmación genérico y reutilizable, sin lógica de negocio
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() titulo = 'Confirmar acción';
  @Input() mensaje = '¿Deseas continuar?';
  @Input() textoConfirmar = 'Confirmar';
  @Input() textoCancelar = 'Cancelar';
  @Input() variante: 'danger' | 'primary' = 'primary';

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();
}
