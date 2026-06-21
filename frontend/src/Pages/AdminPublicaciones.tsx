import { useEffect, useMemo, useState } from "react";
import Navbar from "../Components/NavBar";
import Toast from "../Components/Toast";
import ConfirmModal from "../Components/ConfirmModal";
import ReportCard from "../Components/ReportCard";
import { getPublicaciones, deletePublicacion } from "../Services/publicaciones.service";
import type { Reporte } from "../Types/reportes";

export default function AdminPublicaciones() {
    const [publicaciones, setPublicaciones] = useState<Reporte[]>([]);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"info"|"success"|"error">("info");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 8;
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const statuses = [
        { value: "all", label: "Todos" },
        { value: "pendiente", label: "Pendiente" },
        { value: "en_revision", label: "En revisión" },
        { value: "resuelto", label: "Resuelto" },
    ];

    useEffect(() => {
        cargar();
    }, []);

    const { filtered, pageItems, total, currentPage } = useMemo(() => {
        const term = search.trim().toLowerCase();
        let filtered = term === ""
            ? publicaciones
            : publicaciones.filter(p => (p.titulo + " " + p.descripcion).toLowerCase().includes(term));

        if (statusFilter !== "all") {
            filtered = filtered.filter(p => p.estado === statusFilter);
        }

        const total = Math.max(1, Math.ceil(filtered.length / pageSize));
        const currentPage = Math.min(page, total);
        const start = (currentPage - 1) * pageSize;
        const pageItems = filtered.slice(start, start + pageSize);

        return { filtered, pageItems, total, currentPage };
    }, [publicaciones, search, page, statusFilter]);

    async function cargar() {
        try {
            setLoading(true);
            const data = await getPublicaciones();
            setPublicaciones(data);
        } catch (e) {
            console.error(e);
            setToastMessage("Error al cargar publicaciones");
            setToastType("error");
        } finally {
            setLoading(false);
        }
    }

    function askDelete(id: number) {
        setSelectedId(id);
        setConfirmOpen(true);
    }

    async function handleDeleteConfirmed() {
        if (selectedId === null) return;

        try {
            await deletePublicacion(selectedId);
            setPublicaciones((prev) => prev.filter(p => p.id !== selectedId));
            setToastMessage("Publicación eliminada");
            setToastType("success");
        } catch (e) {
            console.error(e);
            const msg = (e as any).response?.data?.message || "Error al eliminar publicación";
            setToastMessage(msg);
            setToastType("error");
        } finally {
            setConfirmOpen(false);
            setSelectedId(null);
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 pb-24">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                    <h1 className="text-2xl font-bold">Administrar publicaciones</h1>

                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            placeholder="Buscar por título o descripción..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="border rounded-md px-3 py-2 w-full sm:w-64"
                        />

                        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="border rounded-md px-3 py-2">
                            {statuses.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>

                        <button onClick={cargar} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md">Recargar</button>
                    </div>
                </div>

                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {pageItems.map((p) => (
                            <ReportCard
                                key={p.id}
                                titulo={p.titulo}
                                descripcion={p.descripcion}
                                usuario={p.usuario?.nombre ?? "Desconocido"}
                                fecha={new Date(p.createdAt).toLocaleDateString("es-CL")}
                                imagen={p.imagenUrl || "https://placehold.co/400x300?text=Sin+imagen"}
                                estado={p.estado}
                                onDelete={() => askDelete(p.id)}
                            />
                        ))}

                        {filtered.length === 0 && (
                            <p className="text-gray-600">No hay publicaciones.</p>
                        )}

                        {/* Paginación simple */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-gray-600">Mostrando {Math.min((currentPage-1)*pageSize+1, filtered.length)} - {Math.min(currentPage*pageSize, filtered.length)} de {filtered.length}</div>
                            <div className="flex gap-2">
                                <button onClick={() => setPage((p) => Math.max(1, p-1))} className="px-3 py-1 rounded-md border">Anterior</button>
                                <button onClick={() => setPage((p) => Math.min(total, p+1))} className="px-3 py-1 rounded-md border">Siguiente</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <ConfirmModal
                open={confirmOpen}
                message="¿Estás seguro que deseas eliminar esta publicación? Esta acción no se puede deshacer."
                onConfirm={handleDeleteConfirmed}
                onCancel={() => { setConfirmOpen(false); setSelectedId(null); }}
            />

            <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
        </div>
    );
}
