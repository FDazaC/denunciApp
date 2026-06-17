import { FiHome, FiPlusCircle, FiList, FiUser } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { path: "/inicio", label: "Inicio", icon: FiHome },
        { path: "/crear-reporte", label: "Crear", icon: FiPlusCircle },
        { path: "/mis-reportes", label: "Mis Reportes", icon: FiList },
        { path: "/perfil", label: "Perfil", icon: FiUser },
    ];

    return (
        <nav className="bottom-nav">
            <div className="bottom-nav-container">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = location.pathname === tab.path;

                    return (
                        <button
                            key={tab.path}
                            onClick={() => navigate(tab.path)}
                            className={`bottom-nav-tab ${isActive ? "active" : ""}`}
                            aria-label={tab.label}
                            title={tab.label}
                        >
                            <Icon className="bottom-nav-icon" />
                            <span className="bottom-nav-label">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
