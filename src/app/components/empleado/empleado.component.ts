import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado } from '../../models/empleado';

// Smart Component: orquesta el estado reactivo y delega el renderizado a componentes presentacionales
@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.css'
})
export class EmpleadoComponent implements OnInit {
  readonly empleados$ = this.empleadoService.empleados$;
  readonly error$ = this.empleadoService.error$;
  readonly success$ = this.empleadoService.success$;

  empleadoSeleccionado: Empleado | null = null;
  empleadoAEliminar: Empleado | null = null;
  confirmarEliminarVisible = false;

  constructor(private readonly empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.empleadoService.loadEmpleados();
  }

  onCrear(empleado: Empleado): void {
    this.empleadoService.createEmpleado(empleado);
  }

  onActualizar(empleado: Empleado): void {
    if (!empleado._id) return;
    this.empleadoService.updateEmpleado(empleado._id, empleado);
    this.empleadoSeleccionado = null;
  }

  onSolicitarEliminar(empleado: Empleado): void {
    this.empleadoAEliminar = empleado;
    this.confirmarEliminarVisible = true;
  }

  onConfirmarEliminar(): void {
    if (this.empleadoAEliminar?._id) {
      this.empleadoService.deleteEmpleado(this.empleadoAEliminar._id, this.empleadoAEliminar.nombre);
    }
    this.cerrarConfirmacion();
  }

  onCancelarEliminar(): void {
    this.cerrarConfirmacion();
  }

  onSeleccionar(empleado: Empleado): void {
    this.empleadoSeleccionado = { ...empleado };
  }

  onCancelar(): void {
    this.empleadoSeleccionado = null;
  }

  private cerrarConfirmacion(): void {
    this.confirmarEliminarVisible = false;
    this.empleadoAEliminar = null;
  }
}


