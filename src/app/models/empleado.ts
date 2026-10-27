export interface Empleado {
    nombre: string
    cargo: string
    departamento: string
    sueldo: number
    createdAt?: string
    updatedAt?: string
    _id?: string
}

export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}
