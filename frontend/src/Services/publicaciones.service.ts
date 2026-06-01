import { api } from "./api";

interface CreatePublicacionData {
    titulo: string;
    descripcion: string;
    imagenUrl?: string;
}

export async function uploadImage(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
        "/publicaciones/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
}

export async function createPublicacion(data: CreatePublicacionData) {
    const response = await api.post(
        "/publicaciones",
        data
    );

    return response.data;
}

export async function getPublicaciones() {
    const res = await api.get("/publicaciones");
    return res.data;
}

export async function getMisReportes(){
    const res = await api.get("/publicaciones/mis-reportes");
    return res.data;
}

export async function deletePublicacion(id: number) {
    const response = await api.delete(`/publicaciones/${id}`);
    return response.data;
}

export async function getPublicacion(id: number) {
    const res = await api.get(`/publicaciones/${id}`);
    return res.data;
}

export async function updatePublicacion(id: number,
    data: {
        titulo: string;
        descripcion: string;
        imagenUrl?: string;
    }
) {
    const res = await api.patch(`/publicaciones/${id}`,data);
    return res.data;
}

export async function updateEstadoPublicacion(id: number, estado: string){
    const res = await api.patch(`/publicaciones/${id}/estado`, {estado});
    return res.data;
}