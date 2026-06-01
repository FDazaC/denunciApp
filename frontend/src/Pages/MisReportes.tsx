import { useEffect, useState } from "react";
import Navbar from "../Components/NavBar";
import ReportCard from "../Components/ReportCard";
import {getMisReportes, deletePublicacion} from "../Services/publicaciones.service";
import { useNavigate } from "react-router-dom";

export default function MisReportes() {
    const [reportes, setReportes] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        cargarReportes();
    }, []);

    async function cargarReportes() {
        try {
            const data = await getMisReportes();
            setReportes(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function eliminar(id: number) {
        if (!confirm("¿Eliminar reporte?")) {return;}

        try {
            await deletePublicacion(id);
            setReportes(reportes.filter((r) => r.id !== id));
            
        } catch (error) {
            console.error(error);
            alert("Error al eliminar reporte");
        }
    }

    function editar(id: number) {
        navigate(`/editar-reporte/${id}`);
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-10">

                    <button onClick={() => navigate("/inicio")} 
                        className="mb-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
                                   font-semibold px-5 py-3 rounded-xl hover:shadow-xl transition-all duration-200">
                        Volver al inicio
                    </button>

                    <h2 className="text-4xl font-bold text-gray-800">
                        Mis Reportes
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Administra tus reportes publicados
                    </p>
                </div>

                {reportes.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl shadow text-center">
                        <p className="text-gray-500">
                            Aún no has creado reportes.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
        </div>
    );
}