import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPublicacion,updatePublicacion } from "../Services/publicaciones.service";

export default function EditarReporte() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagenUrl, setImagenUrl] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarReporte();
    }, []);

    async function cargarReporte() {
        try {
            const reporte = await getPublicacion(Number(id));

            setTitulo(reporte.titulo);
            setDescripcion(reporte.descripcion);
            setImagenUrl(reporte.imagenUrl ?? "");

        } catch (error) {
            console.error(error);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            setLoading(true);

            await updatePublicacion(Number(id),
                {
                    titulo,
                    descripcion,
                    imagenUrl,
                }
            );

            alert("Reporte actualizado");

            navigate("/mis-reportes");

        } catch (error) {
            console.error(error);
            alert("Error al actualizar reporte");
        } finally {setLoading(false);}
    }

    return (
        <div className="min-h-screen bg-slate-100 flex justify-center items-center p-6">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl">
                <h1 className="text-3xl font-bold mb-6">
                    Editar Reporte
                </h1>

                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full border rounded-lg p-3 mb-4"
                    placeholder="Título"
                />

                <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full border rounded-lg p-3 mb-4"
                    rows={5}
                />

                {imagenUrl && (
                    <img
                        src={imagenUrl}
                        alt="Reporte"
                        className="w-full h-60 object-cover rounded-lg mb-4"
                    />
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                >
                    {loading ? "Guardando..." : "Guardar cambios"}
                </button>
            </form>
        </div>
    );
}