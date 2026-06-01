import { useState, useEffect } from "react";
import Navbar from "../Components/NavBar";
import ReportCard from "../Components/ReportCard";
import { getPublicaciones , updateEstadoPublicacion} from "../Services/publicaciones.service";


export default function Inicio() {
    const[reportes, setReportes] = useState<any[]>([]);
    useEffect(() => {
        async function cargarReportes(){
            try {
                const data = await getPublicaciones();
                setReportes(data.slice(0 , 3));

            }catch(error){
                console.error(error);
            }
        }

        cargarReportes();
    }, []);

    async function cambiarEstado(id: number, estado: string){
        try {
            await updateEstadoPublicacion(id, estado);
            setReportes(reportes.map((r) => r.id === id ? {...r, estado} : r));
        }catch(e){
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
                        onEstadoChange={(estado) => cambiarEstado(reporte.id, estado)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}