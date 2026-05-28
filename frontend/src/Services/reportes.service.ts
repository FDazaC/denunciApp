import { api } from "./api";

export async function obtenerReportes() {
    const res = await api.get("/reportes");
    return res.data;
}