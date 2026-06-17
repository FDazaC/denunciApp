import { api } from "./api";

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    nombre: string;
    email: string;
    password: string;
    rut: string;
}

export async function login(data: LoginData) {
    const response = await api.post("/auth/login", data);
    return response.data;
}

export async function register(data: RegisterData) {
    const response = await api.post("/auth/register", data);
    return response.data;
}

export async function getProfile() {
    const token = localStorage.getItem("token");
    const response = await api.get("/users/profile",{
        headers: {
            Authorization:`Bearer ${token}`,
        },
    });

    return response.data;
}