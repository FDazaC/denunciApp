import { FiUser, FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <header className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xl">
                D
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        DenunciApp
                    </h1>

                    <p className="text-sm text-gray-500">
                        Reportes universitarios
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">

                <button onClick={() => navigate("/crear-reporte")}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl transition">
                    <FiPlusCircle />Nuevo Reporte
                </button>

                <button onClick={() => navigate("/perfil")}
                className="flex items-center gap-2 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-xl transition">
                    <FiUser />Perfil
                </button>
            </div>
        </header>
    );
}