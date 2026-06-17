interface Props {
    titulo: string;
    descripcion: string;
    usuario: string;
    estado?: string;
    fecha: string;
    imagen: string;
    onDelete?: () => void;
    onEdit?: () => void;
    onEstadoChange?: (estado: string) => void;
}

export default function ReportCard({
    titulo,
    descripcion,
    usuario,
    estado,
    fecha,
    imagen,
    onDelete,
    onEdit,
    onEstadoChange,
}: Props) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const esAdmin = user.rol === "admin";

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition">
            <img src={imagen} alt={titulo} className="w-full h-52 object-cover"/>

            <div className="p-5">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    {titulo}
                </h3>

                <p className="text-gray-600 mt-2 text-sm">
                    {descripcion}
                </p>

                <div className="mt-4 text-sm text-gray-500 flex flex-col gap-1">
                    <span className="text-sm">
                        Publicado por: {usuario}
                    </span>

                    <span className="text-sm">
                        {fecha}
                    </span>

                    {esAdmin ? (
                        <select value={estado} onChange={(e) => onEstadoChange?.(e.target.value)} className="mt-2 border rounded-lg px-2 py-1 text-sm">
                            <option value="pendiente">Pendiente</option>
                            <option value="en_revision">En revisión</option>
                            <option value="resuelto">Resuelto</option>
                        </select>
                    ) : (
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                estado === "resuelto" ? "bg-green-100 text-green-700"
                                    : estado === "en_revision"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            Estado: {estado}
                        </span>
                    )}
                </div>

                {(onEdit || onDelete) && (
                    <div className="flex gap-2 mt-4 flex-col sm:flex-row">
                        {onEdit && (
                            <button onClick={onEdit} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-lg transition w-full sm:w-auto">
                                Editar
                            </button>
                        )}

                        {onDelete && (
                            <button onClick={onDelete} className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition w-full sm:w-auto">
                                Eliminar
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}