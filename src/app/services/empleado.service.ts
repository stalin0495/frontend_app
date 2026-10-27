import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Empleado, ApiResponse } from '../models/empleado';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private readonly URL_API = `${environment.apiUrl}/empleados`;

  // Estado privado y mutación por referencias inmutables; el exterior solo ve flujos de solo lectura
  private readonly empleadosSubject = new BehaviorSubject<Empleado[]>([]);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  private readonly successSubject = new BehaviorSubject<string | null>(null);

  readonly empleados$: Observable<Empleado[]> = this.empleadosSubject.asObservable();
  readonly error$: Observable<string | null> = this.errorSubject.asObservable();
  readonly success$: Observable<string | null> = this.successSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadEmpleados(): void {
    this.http.get<ApiResponse<Empleado[]>>(this.URL_API).pipe(
      map((res) => res.data),
      catchError((err) => this.handleError(err, [])),
    ).subscribe((empleados) => {
      this.errorSubject.next(null);
      this.empleadosSubject.next(empleados);
    });
  }

  createEmpleado(empleado: Empleado): void {
    this.http.post<ApiResponse<Empleado>>(this.URL_API, empleado).pipe(
      map((res) => res.data),
      catchError((err) => this.handleError(err, null)),
    ).subscribe((nuevo) => {
      if (!nuevo) return;
      this.empleadosSubject.next([...this.empleadosSubject.value, nuevo]);
      this.notifySuccess(`Empleado "${nuevo.nombre}" creado correctamente`);
    });
  }

  updateEmpleado(id: string, empleado: Partial<Empleado>): void {
    this.http.put<ApiResponse<Empleado>>(`${this.URL_API}/${id}`, empleado).pipe(
      map((res) => res.data),
      catchError((err) => this.handleError(err, null)),
    ).subscribe((actualizado) => {
      if (!actualizado) return;
      const actual = this.empleadosSubject.value;
      this.empleadosSubject.next(actual.map((e) => (e._id === id ? actualizado : e)));
      this.notifySuccess(`Empleado "${actualizado.nombre}" actualizado correctamente`);
    });
  }

  deleteEmpleado(id: string, nombre?: string): void {
    this.http.delete<ApiResponse<Empleado>>(`${this.URL_API}/${id}`).pipe(
      map(() => id),
      catchError((err) => this.handleError(err, null)),
    ).subscribe((deletedId) => {
      if (!deletedId) return;
      const actual = this.empleadosSubject.value;
      this.empleadosSubject.next(actual.filter((e) => e._id !== deletedId));
      this.notifySuccess(`Empleado "${nombre ?? ''}" eliminado correctamente`);
    });
  }

  private notifySuccess(message: string): void {
    this.errorSubject.next(null);
    this.successSubject.next(message);
    setTimeout(() => this.successSubject.next(null), 4000);
  }

  private handleError<T>(err: HttpErrorResponse, fallback: T): Observable<T> {
    const message = err.error?.message ?? 'Ocurrió un error al comunicarse con el servidor';
    this.errorSubject.next(message);
    return new BehaviorSubject(fallback).asObservable();
  }
}

