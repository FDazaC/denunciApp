import { useState, useEffect } from "react";
import Navbar from "../Components/NavBar";
import ReportCard from "../Components/ReportCard";
import MapaReportes from "../Components/MapaReportes";
import { getPublicaciones, updateEstadoPublicacion } from "../Services/publicaciones.service";
import { getCurrentDeviceLocation, type DeviceLocation } from "../Services/device.service";
import Toast from "../Components/Toast";
import type { Reporte } from "../Types/reportes";

export default function Inicio() {
    const [reportes, setReportes] = useState<Reporte[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [ubicacionActual, setUbicacionActual] = useState<DeviceLocation | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"info"|"success"|"error">("info");

    useEffect(() => {
        async function cargarReportes() {
            try {
                const data = await getPublicaciones();
                setReportes(data);
            } catch (error) {
                console.error(error);
            }
        }

        cargarReportes();
    }, []);

    useEffect(() => {
        async function cargarUbicacionActual() {
            const location = await getCurrentDeviceLocation();
            setUbicacionActual(location);

            if (location === null) {
                setToastMessage("No se pudo obtener ubicación. Verifica los permisos.");
                setToastType("error");
            }
        }

        cargarUbicacionActual();
    }, []);

    async function cambiarEstado(id: number, estado: string) {
        try {
            await updateEstadoPublicacion(id, estado);
            setReportes((prev) => prev.map((r) => r.id === id ? { ...r, estado } : r));
        } catch (e) {
            console.log(e);
            alert("Error al cambiar estado");
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 pb-24">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10 pb-28">
                <div className="mb-10">
                    <h2 className="text-4xl font-bold text-gray-800">
                        Últimos Reportes
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Revisa los últimos problemas reportados
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                        <label className="text-sm text-gray-600">Filtrar por estado:</label>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded-md px-3 py-2">
                            <option value="all">Todos</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="en_revision">En revisión</option>
                            <option value="resuelto">Resuelto</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="flex flex-col gap-6">
                            {reportes
                                .filter(r => filterStatus === "all" ? true : r.estado === filterStatus)
                                .slice(0, 3)
                                .map((reporte) => (
                                    <ReportCard
                                        key={reporte.id}
                                        titulo={reporte.titulo}
                                        descripcion={reporte.descripcion}
                                        usuario={reporte.usuario?.nombre ?? "Usuario"}
                                        fecha={new Date(reporte.createdAt).toLocaleDateString("es-CL")}
                                        imagen={reporte.imagenUrl || "https://placehold.co/600x400"}
                                        estado={reporte.estado}
                                        onEstadoChange={(estado) =>
                                            cambiarEstado(reporte.id, estado)
                                        }
                                    />
                                ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                Mapa de Reportes
                            </h3>

                            <MapaReportes
                                reportes={reportes.filter(r => filterStatus === "all" ? true : r.estado === filterStatus)}
                                currentLocation={ubicacionActual}
                            />

                            <div className="flex flex-wrap gap-6 mt-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full bg-red-500"></span>
                                    <span className="text-sm text-gray-700">
                                        Pendiente
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full bg-yellow-400"></span>
                                    <span className="text-sm text-gray-700">
                                        En revisión
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full bg-green-500"></span>
                                    <span className="text-sm text-gray-700">
                                        Resuelto
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
        </div>
    );
}