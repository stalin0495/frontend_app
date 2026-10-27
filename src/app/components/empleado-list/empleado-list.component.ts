import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Empleado } from '../../models/empleado';

// Dumb Component: solo recibe datos por @Input() y notifica intenciones por @Output()
@Component({
  selector: 'app-empleado-list',
  templateUrl: './empleado-list.component.html',
  styleUrl: './empleado-list.component.css'
})
export class EmpleadoListComponent {
  @Input() empleados: Empleado[] = [];
  @Output() seleccionar = new EventEmitter<Empleado>();
  @Output() eliminar = new EventEmitter<Empleado>();

  trackById(_index: number, empleado: Empleado): string {
    return empleado._id ?? _index.toString();
  }

  iniciales(nombre: string): string {
    return nombre
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((parte) => parte.charAt(0).toUpperCase())
      .join('');
  }
}
