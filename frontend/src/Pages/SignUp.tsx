import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiUser, FiMail, FiLock, FiCreditCard, } from "react-icons/fi";
import { register } from "../Services/auth.service";
import { requestLocationPermission } from "../Services/device.service";

export default function SignUp() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [rut, setRut] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!nombre || !email || !rut || !password ||!confirmPassword) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Correo inválido.");
            return;
        }

        const rutRegex = /^\d{7,8}-[0-9Kk]$/;
        if (!rutRegex.test(rut)) {
            setError("RUT inválido. Ej: 12345678-9");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await register({
                nombre,
                email,
                rut,
                password,
            });

            localStorage.setItem("token",data.token);
            
            // Pedir permiso de ubicación antes de ir a Inicio
            await requestLocationPermission();
            
            navigate("/inicio");

        } catch (err: any) {
            setError(err.response?.data?.message || "Error al registrarse");
        } finally {setLoading(false);}
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center px-6 py-10">
            <div className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl -top-20 -left-20 animate-pulse" />
            <div className="absolute w-80 h-80 rounded-full bg-white/10 blur-3xl bottom-0 right-0 animate-pulse" />

            <button
                onClick={() => navigate("/")}
                className="absolute top-5 left-5 flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md hover:bg-white/30 transition"
            >
                <FiHome />
                Home
            </button>

            <div className="relative z-10 w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2">
                <div className="hidden lg:flex relative flex-col items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-700 text-white p-12 overflow-hidden">
                    <div className="absolute w-52 h-52 rounded-full bg-white/10 -top-10 -left-10" />
                    <div className="absolute w-40 h-40 rounded-full bg-white/10 bottom-10 right-10" />

                    <h2 className="text-4xl font-bold text-center">
                        Únete a DenunciApp
                    </h2>

                    <p className="mt-6 text-center text-white/80 max-w-sm">
                        Reporta problemas dentro de tu universidad y ayuda a mejorar la comunidad.
                    </p>

                    <div className="mt-10 w-72 h-72 rounded-full bg-white/10 flex items-center justify-center text-8xl font-bold">
                        D
                    </div>
                </div>

                {/* formulario */}
                <div className="bg-gray-50 p-8 lg:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Crear Cuenta
                    </h2>

                    <p className="text-gray-500 mt-2 mb-8">
                        Completa tus datos
                    </p>

                    {error && (
                        <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
                        {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                                <FiUser /> Nombre Completo
                            </label>

                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ingrese su nombre"
                                disabled={loading}
                                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                                <FiMail />Correo
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="usuario@correo.com"
                                disabled={loading}
                                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                                <FiCreditCard />
                                RUT
                            </label>

                            <input
                                type="text"
                                value={rut}
                                onChange={(e) =>setRut(e.target.value)}
                                placeholder="12345678-9"
                                disabled={loading}
                                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                                <FiLock />Contraseña
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ingrese contraseña"
                                disabled={loading}
                                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                                <FiLock />Confirmar Contraseña
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>setConfirmPassword(e.target.value)}
                                placeholder="Repita contraseña"
                                disabled={loading}
                                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500"
                            />
                        </div>

                        <button type="submit" disabled={loading}
                            className="mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 font-semibold shadow-lg hover:-translate-y-1 transition"
                            >
                            {loading ? "Creando cuenta..." : "Registrarse"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-gray-600">
                        ¿Ya tienes cuenta?

                        <span onClick={() => navigate("/")} className="ml-2 text-indigo-600 font-semibold cursor-pointer hover:text-purple-700">
                            Inicia sesión
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}