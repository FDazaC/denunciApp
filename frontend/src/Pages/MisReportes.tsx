import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/NavBar";
import BackButton from "../Components/BackButton";
import ReportCard from "../Components/ReportCard";
import Toast from "../Components/Toast";
import {getMisReportes, deletePublicacion} from "../Services/publicaciones.service";

export default function MisReportes() {
    const [reportes, setReportes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"info" | "success" | "error">("info");
    const navigate = useNavigate();

    useEffect(() => {
        cargarReportes();

        const handleUpdate = () => cargarReportes();
        window.addEventListener("reportesUpdated", handleUpdate);
        return () => window.removeEventListener("reportesUpdated", handleUpdate);
    }, []);

    async function cargarReportes() {
        setLoading(true);
        try {
            const data = await getMisReportes();
            setReportes(data);
            if (data.length === 0) {
                setToastMessage("Aún no tienes reportes. Crea uno para empezar.");
                setToastType("info");
            }
        } catch (error) {
            console.error(error);
            setToastMessage("Error al cargar tus reportes. Intenta de nuevo.");
            setToastType("error");
        } finally {
            setLoading(false);
        }
    }

    async function eliminar(id: number) {
        if (!confirm("¿Eliminar reporte?")) {return;}

        try {
            await deletePublicacion(id);
            setReportes(reportes.filter((r) => r.id !== id));
            setToastMessage("Reporte eliminado correctamente.");
            setToastType("success");
        } catch (error) {
            console.error(error);
            setToastMessage("Error al eliminar reporte.");
            setToastType("error");
        }
    }

    function editar(id: number) {
        navigate(`/editar-reporte/${id}`);
    }

    return (
        <div className="min-h-screen bg-slate-100 pb-24">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <BackButton className="mb-6" />

                        <h2 className="text-4xl font-bold text-gray-800">
                            Mis Reportes
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Administra tus reportes publicados y recibe notificaciones cuando cambien de estado.
                        </p>
                    </div>

                    <button
                        onClick={cargarReportes}
                        disabled={loading}
                        className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Actualizando..." : "Actualizar reportes"}
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="animate-pulse rounded-3xl bg-white p-6 shadow-sm">
                                <div className="h-44 rounded-2xl bg-slate-200 mb-5" />
                                <div className="h-5 bg-slate-200 rounded mb-3" />
                                <div className="h-4 bg-slate-200 rounded mb-3 w-5/6" />
                                <div className="h-10 bg-slate-200 rounded mt-4" />
                            </div>
                        ))}
                    </div>
                ) : reportes.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl shadow text-center">
                        <p className="text-gray-500">
                            Aún no has creado reportes.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {reportes.map((reporte) => (
                            <ReportCard
                                key={reporte.id}
                                titulo={reporte.titulo}
                                descripcion={reporte.descripcion}
                                usuario={reporte.usuario?.nombre ?? "Usuario"}
                                fecha={new Date(reporte.createdAt).toLocaleDateString("es-CL")}
                                imagen={reporte.imagenUrl || "https://placehold.co/600x400"}
                                estado={reporte.estado}
                                onEdit={() => editar(reporte.id)}
                                onDelete={() => eliminar(reporte.id)}
                            />
                        ))}
                    </div>
                )}
            </main>

            <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
        </div>
    );
}