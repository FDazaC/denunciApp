import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {uploadImage,createPublicacion} from "../Services/publicaciones.service";
import MapaSelector from "../Components/MapaSelector";
import "../styles/CrearReporte.css";

export default function CrearReporte() {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [latitud, setLatitud] = useState<number | null>(null);
    const [longitud, setLongitud] = useState<number | null>(null);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            setLoading(true);

            let imagenUrl = "";

            if (imagen) {
                const upload = await uploadImage(imagen);
                imagenUrl = upload.url;
            }

            if(latitud === null || longitud === null){
                alert("Debes ingresar la ubicacion del reporte");
                return;
            }

            await createPublicacion({
                titulo,
                descripcion,
                imagenUrl,
                latitud,
                longitud,
            });

            alert("Reporte creado");

            setTitulo("");
            setDescripcion("");
            setImagen(null);

            navigate("/inicio");

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
                <button type="button" onClick={() => navigate("/inicio")} className="volver-btn">
                    Volver al inicio
                </button>
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

                <h3>Selecciona la ubicacion del reporte</h3>
                <MapaSelector
                    onLocationSelect={(lat,lng) => {
                        setLatitud(lat);
                        setLongitud(lng);
                    }}
                />

                {latitud !== null && longitud !== null && (
                    <div>
                        Latitud: {latitud}
                        <br />
                        Longitud: {longitud}
                    </div>
                )}
                <button type="submit"disabled={loading}>
                    {loading ? "Publicando..." : "Publicar reporte"}
                </button>
                
                <h1>Vista previa</h1>
                {imagen && (
                    <img src={URL.createObjectURL(imagen)} alt="Preview"className="preview-imagen"/>
                )}
            </form>
        </div>
    );
}