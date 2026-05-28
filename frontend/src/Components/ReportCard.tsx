interface Props {
    titulo: string;
    descripcion: string;
    usuario: string;
    fecha: string;
    imagen: string;
}

export default function ReportCard({
    titulo,
    descripcion,
    usuario,
    fecha,
    imagen,
}: Props) {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition">
            <img src={imagen} alt={titulo}className="w-full h-52 object-cover"/>

            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800">
                    {titulo}
                </h3>

                <p className="text-gray-600 mt-2">
                    {descripcion}
                </p>

                <div className="mt-4 text-sm text-gray-500 flex flex-col gap-1">
                    <span>
                        Publicado por: {usuario}
                    </span>

                    <span>
                        {fecha}
                    </span>
                </div>
            </div>
        </div>
    );
}