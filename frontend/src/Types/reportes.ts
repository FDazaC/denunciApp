export interface ReporteUsuario {
    nombre?: string;
}

export interface Reporte {
    id: number;
    titulo: string;
    descripcion: string;
    imagenUrl?: string;
    estado: string;
    latitud: number | string;
    longitud: number | string;
    createdAt: string;
    usuario?: ReporteUsuario;
}
