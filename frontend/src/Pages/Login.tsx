import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiHome, FiShield, FiZap, FiHeart, } from "react-icons/fi";

import { login } from "../Services/auth.service";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email || !password) { setError("Debe ingresar correo y contraseña."); return;}

        setLoading(true);
        setError("");

        try {
            const data = await login({
                email,
                password,
        });

        localStorage.setItem("token", data.token);

        navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center">
        <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-10 -left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -bottom-20 -right-20 animate-pulse" />

        <button onClick={() => navigate("/")} className="absolute top-5 left-5 z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition">
            <FiHome />Home
        </button>

        <div className="relative z-10 w-full flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Bienvenido
                    </h1>
                    <p className="text-gray-500 mt-2">Inicia sesión con tu cuenta</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl bg-red-100 border border-red-300 text-red-700 px-4 py-3">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-700 flex items-center gap-2">
                            <FiMail />Correo Electrónico
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="usuario@correo.com"
                            disabled={loading}
                            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-700 flex items-center gap-2">
                            <FiLock />Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingrese su contraseña"
                            disabled={loading}
                            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-white font-semibold shadow-lg transition hover:-translate-y-1 hover:shadow-xl disabled:opacity-70">
                        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </button>
                </form>

                <div className="mt-8 border-t pt-6 text-center text-gray-600">
                     ¿No tienes cuenta?

                    <span onClick={() => navigate("/register")} className="ml-2 font-semibold text-indigo-600 hover:text-purple-700 cursor-pointer">
                        Regístrate aquí
                    </span>
                </div>
            </div>

            <div className="hidden xl:flex absolute right-70 flex-col justify-center gap-8 text-white">
                <div className="text-center">
                    <FiShield className="mx-auto text-5xl mb-4" />
                    <h3 className="text-xl font-semibold">
                        Seguro
                    </h3>
                    <p className="opacity-90">Tu información está protegida</p>
                </div>

                <div className="text-center">
                    <FiZap className="mx-auto text-5xl mb-4" />
                    <h3 className="text-xl font-semibold">
                        Rápido
                    </h3>
                    <p className="opacity-90">Acceso inmediato</p>
                </div>

                <div className="text-center">
                    <FiHeart className="mx-auto text-5xl mb-4" />
                    <h3 className="text-xl font-semibold">
                    Confiable
                    </h3>
                    <p className="opacity-90">Servicio garantizado</p>
                </div>
            </div>
        </div>
    </div>
  );
}