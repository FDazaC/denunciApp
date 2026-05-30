import { useState } from "react";
import {uploadImage,createPublicacion} from "../Services/publicaciones.service";
import "../styles/CrearReporte.css";

export default function CrearReporte() {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            setLoading(true);

            let imagenUrl = "";

            if (imagen) {
                const upload = await uploadImage(imagen);
                imagenUrl = upload.url;
            }

            await createPublicacion({
                titulo,
                descripcion,
                imagenUrl,
            });

            alert("Reporte creado");

            setTitulo("");
            setDescripcion("");
            setImagen(null);

        } catch (error) {
            console.error(error);
            alert("Error al crear reporte");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="crear-reporte-page">
            <form className="crear-reporte-form" onSubmit={handleSubmit}>
                <h1>Crear Reporte</h1>

                <input
                    type="text"
                    placeholder="Título del reporte"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Describe el problema..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                />

                <label
                    htmlFor="imagen"
                    className="file-upload-label"
                >
                    {imagen ? "Cambiar imagen" : "Seleccionar imagen"}
                </label>

                <input
                    id="imagen"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            setImagen(e.target.files[0]);
                        }
                    }}
                />

                {imagen && (
                    <span className="nombre-archivo">
                        {imagen.name}
                    </span>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Publicando..."
                        : "Publicar reporte"}
                </button>

                {imagen && (
                    <img
                        src={URL.createObjectURL(imagen)}
                        alt="Preview"
                        className="preview-imagen"
                    />
                )}
            </form>
        </div>
    );
}