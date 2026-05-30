import Navbar from "../Components/NavBar";
import ReportCard from "../Components/ReportCard";

export default function Inicio() {
    const reportes = [
        {
        titulo: "Calle en mal estado",
        descripcion: "Cerca de la biblioteca UCN",
        usuario: "Cristiano Ronaldo",
        fecha: "19/04/2026",
        imagen:
            "https://www.noticias.ucn.cl/wp-content/files_mf/cache/th_7445c7bc99903fe147f3c84bdb82a492_bibliotecacoquimbo1.jpeg",
        },

        {
        titulo: "Gotera en el techo",
        descripcion: "Edificio X sala-107",
        usuario: "Alexis Sánchez",
        fecha: "10/04/2026",
        imagen:
            "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
        },

        {
        titulo: "Postes sin luz",
        descripcion: "Cancha de fútbol",
        usuario: "MatiGol2006",
        fecha: "12/03/2026",
        imagen:
            "https://images.unsplash.com/photo-1517466787929-bc90951d0974",
        },
    ];

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
                    {reportes.map((reporte, index) => (
                        <ReportCard
                        key={index}
                        titulo={reporte.titulo}
                        descripcion={reporte.descripcion}
                        usuario={reporte.usuario}
                        fecha={reporte.fecha}
                        imagen={reporte.imagen}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}