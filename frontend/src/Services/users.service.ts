import { api } from "./api";

export async function getProfile() {
    const response = await api.get("/users/profile");
    return response.data;
}

export async function updateProfile(data: {
    nombre: string;
    email: string;
    rut: string;
}) {
    const response = await api.patch(
        "/users/profile",
        data
    );

    return response.data;
}