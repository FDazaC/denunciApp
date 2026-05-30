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

export async function createPublicacion(
    data: CreatePublicacionData
) {
    const response = await api.post(
        "/publicaciones",
        data
    );

    return response.data;
}