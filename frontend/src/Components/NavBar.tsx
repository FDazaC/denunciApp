import { FiUser, FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function Navbar() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const esAdmin = user?.rol === "admin";
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login");
        setMobileMenuOpen(false);
    };

    return (
        <header className="w-full bg-white shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                D
                </div>

                <div>
                    <h1 className="text-base sm:text-2xl font-bold text-gray-800">
                        DenunciApp
                    </h1>

                    <p className="text-xs text-gray-500 hidden sm:block">
                        Reportes universitarios
                    </p>
                </div>
            </div>

            <nav className="flex items-center gap-2 sm:gap-3">
                {/* Desktop Menu */}
                <div className="hidden sm:flex items-center gap-3">
                    <button onClick={() => navigate("/crear-reporte")}
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-lg transition text-sm font-medium">
                        <FiPlusCircle className="text-base" />
                        Nuevo Reporte
                    </button>

                    <button onClick={() => navigate("/mis-reportes")}
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-lg transition text-sm font-medium">
                        Mis Reportes
                    </button>
                    
                    <button onClick={() => navigate("/perfil")}
                    className="flex items-center gap-2 border border-gray-300 hover:bg-gray-100 px-3 py-2 rounded-lg transition text-sm font-medium">
                        <FiUser className="text-base" />
                        Perfil
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="sm:hidden flex flex-col gap-1 p-2 hover:bg-gray-100 rounded-lg transition"
                    aria-label="Toggle menu"
                >
                    <span className="block w-5 h-0.5 bg-gray-800"></span>
                    <span className="block w-5 h-0.5 bg-gray-800"></span>
                    <span className="block w-5 h-0.5 bg-gray-800"></span>
                </button>
            </nav>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg sm:hidden">
                    <div className="flex flex-col gap-2 p-3">
                        <button onClick={() => { navigate("/crear-reporte"); setMobileMenuOpen(false); }}
                            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-3 py-3 rounded-lg transition text-sm font-medium w-full">
                            <FiPlusCircle className="text-base" />
                            Nuevo Reporte
                        </button>

                        <button onClick={() => { navigate("/mis-reportes"); setMobileMenuOpen(false); }}
                            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-3 py-3 rounded-lg transition text-sm font-medium w-full">
                            Mis Reportes
                        </button>
                        
                        {esAdmin && (
                            <button onClick={() => { navigate("/admin/publicaciones"); setMobileMenuOpen(false); }}
                                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-3 py-3 rounded-lg transition text-sm font-medium w-full">
                                Gestionar publicaciones
                            </button>
                        )}

                        <button onClick={() => { navigate("/perfil"); setMobileMenuOpen(false); }}
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-3 py-3 rounded-lg transition text-sm font-medium w-full">
                            <FiUser className="text-base" />
                            Perfil
                        </button>

                        <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-3 rounded-lg transition text-sm font-medium w-full">
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}