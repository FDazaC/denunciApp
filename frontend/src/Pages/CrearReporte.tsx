import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage, createPublicacion } from "../Services/publicaciones.service";
import {
    getCurrentDeviceLocation,
    requestLocationPermission,
    takeReportPhoto,
    chooseReportPhoto,
} from "../Services/device.service";
import Toast from "../Components/Toast";
import MapaSelector from "../Components/MapaSelector";
import "../styles/CrearReporte.css";

export default function CrearReporte() {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingImagen, setLoadingImagen] = useState(false);
    const [latitud, setLatitud] = useState<number | null>(null);
    const [longitud, setLongitud] = useState<number | null>(null);

    const navigate = useNavigate();
    const previewRef = useRef<HTMLDivElement | null>(null);

    const previewUrl = useMemo(
        () => (imagen ? URL.createObjectURL(imagen) : ""),
        [imagen]
    );

    useEffect(() => {
        if (!previewUrl) return;
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"info" | "success" | "error">("info");

    function showToast(msg: string, type: "info" | "success" | "error" = "info") {
        setToastMessage(msg);
        setToastType(type);
    }

    useEffect(() => {
        async function inicializar() {
            // 1. Pedir permiso de ubicación
            const ok = await requestLocationPermission();

            if (!ok) {
                showToast(
                    "Permiso de ubicación denegado. Selecciona la ubicación manualmente en el mapa.",
                    "error"
                );
                return;
            }

            const location = await getCurrentDeviceLocation();
            if (location) {
                setLatitud(location.lat);
                setLongitud(location.lng);
            }
        }

        inicializar();
    }, []);

    async function seleccionarImagenDesdeCamara() {
        try {
            setLoadingImagen(true);
            const file = await takeReportPhoto();
            setImagen(file);
            setTimeout(() => {
                previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } catch (error: any) {
            console.error(error);
            showToast(error?.message ?? "No se pudo tomar la foto", "error");
        } finally {
            setLoadingImagen(false);
        }
    }

    async function seleccionarImagenDesdeGaleria() {
        try {
            setLoadingImagen(true);
            const file = await chooseReportPhoto();
            setImagen(file);
            setTimeout(() => {
                previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } catch (error: any) {
            console.error(error);
            showToast(error?.message ?? "No se pudo cargar la imagen", "error");
        } finally {
            setLoadingImagen(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (latitud === null || longitud === null) {
            showToast("Debes seleccionar la ubicación del reporte", "error");
            return;
        }

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
                latitud,
                longitud,
            });

            showToast("Reporte creado", "success");

            setTitulo("");
            setDescripcion("");
            setImagen(null);

            navigate("/inicio");
        } catch (error) {
            console.error(error);
            showToast("Error al crear reporte", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="crear-reporte-page">
            <form className="crear-reporte-form" onSubmit={handleSubmit}>
                <button
                    type="button"
                    onClick={() => navigate("/inicio")}
                    className="volver-btn"
                >
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

                <div className="acciones-imagen">
                    <button
                        type="button"
                        onClick={seleccionarImagenDesdeCamara}
                        disabled={loadingImagen}
                    >
                        {loadingImagen ? "Abriendo cámara..." : "Sacar foto"}
                    </button>

                    <button
                        type="button"
                        onClick={seleccionarImagenDesdeGaleria}
                        disabled={loadingImagen}
                    >
                        {loadingImagen ? "Cargando..." : "Elegir de galería"}
                    </button>
                </div>

                {imagen && (
                    <span className="nombre-archivo">{imagen.name}</span>
                )}

                <h3>Selecciona la ubicación del reporte</h3>

                <MapaSelector
                    initialLocation={
                        latitud !== null && longitud !== null
                            ? { lat: latitud, lng: longitud }
                            : null
                    }
                    onLocationSelect={(lat, lng) => {
                        setLatitud(lat);
                        setLongitud(lng);
                    }}
                />

                {latitud !== null && longitud !== null && (
                    <p className="coordenadas-info">
                        {latitud.toFixed(5)}, {longitud.toFixed(5)}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Publicando..." : "Publicar reporte"}
                </button>

                <div ref={previewRef}>
                    {previewUrl && (
                        <>
                            <h3>Vista previa</h3>
                            <img
                                src={previewUrl}
                                alt="Vista previa del reporte"
                                className="preview-imagen"
                            />
                        </>
                    )}
                </div>
            </form>

            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage(null)}
            />
        </div>
    );
}