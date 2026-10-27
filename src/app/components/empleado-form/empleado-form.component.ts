import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Empleado } from '../../models/empleado';

const emptyEmpleado = (): Empleado => ({ nombre: '', cargo: '', departamento: '', sueldo: 0 });

// Dumb Component: presentacional y puro, clona sus entradas para no mutar la rejilla del padre
@Component({
  selector: 'app-empleado-form',
  templateUrl: './empleado-form.component.html',
  styleUrl: './empleado-form.component.css'
})
export class EmpleadoFormComponent implements OnChanges {
  @Input() empleado: Empleado | null = null;
  @Output() crear = new EventEmitter<Empleado>();
  @Output() actualizar = new EventEmitter<Empleado>();
  @Output() cancelar = new EventEmitter<void>();

  formModel: Empleado = emptyEmpleado();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['empleado']) {
      this.formModel = this.empleado ? { ...this.empleado } : emptyEmpleado();
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    const payload: Empleado = { ...this.formModel };
    if (payload._id) {
      this.actualizar.emit(payload);
    } else {
      this.crear.emit(payload);
    }
    this.resetForm(form);
  }

  onCancelar(form: NgForm): void {
    this.resetForm(form);
    this.cancelar.emit();
  }

  private resetForm(form: NgForm): void {
    form.resetForm();
    this.formModel = emptyEmpleado();
  }
}
