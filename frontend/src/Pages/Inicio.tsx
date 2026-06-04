import { useState, useEffect } from "react";
import Navbar from "../Components/NavBar";
import ReportCard from "../Components/ReportCard";
import MapaReportes from "../Components/MapaReportes";
import { getPublicaciones, updateEstadoPublicacion } from "../Services/publicaciones.service";

export default function Inicio() {
    const [reportes, setReportes] = useState<any[]>([]);
    const [ultimosReportes, setUltimosReportes] = useState<any[]>([]);

    useEffect(() => {
        async function cargarReportes() {
            try {
                const data = await getPublicaciones();
                setReportes(data);
                setUltimosReportes(data.slice(0, 3));
            } catch (error) {
                console.error(error);
            }
        }

        cargarReportes();
    }, []);

    async function cambiarEstado(id: number, estado: string) {
        try {
            await updateEstadoPublicacion(id, estado);
            setReportes((prev) =>prev.map((r) => r.id === id ? { ...r, estado } : r));
            setUltimosReportes((prev) => prev.map((r) => r.id === id ? { ...r, estado } : r));
        } catch (e) {
            console.log(e);
            alert("Error al cambiar estado");
        }
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-10">
                    <h2 className="text-4xl font-bold text-gray-800">
                        Últimos Reportes
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Revisa los últimos problemas reportados
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="flex flex-col gap-6">
                            {ultimosReportes.map((reporte) => (
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

                            <MapaReportes reportes={reportes} />

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
        </div>
    );
}