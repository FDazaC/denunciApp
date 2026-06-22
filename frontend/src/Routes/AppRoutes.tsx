import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { App } from "@capacitor/app";
import Login from "../Pages/Login";
import Inicio from "../Pages/Inicio";
import SignUp from "../Pages/SignUp";
import CrearReporte from "../Pages/CrearReporte";
import MisReportes from "../Pages/MisReportes";
import EditarReporte from "../Pages/EditarReporte";
import Perfil from "../Pages/Perfil";
import AdminPublicaciones from "../Pages/AdminPublicaciones";
import BottomNav from "../Components/BottomNav";
import { getMisReportes } from "../Services/publicaciones.service";
import { requestNotificationPermission, sendLocalNotification } from "../Services/notifications.service";
import type { Reporte } from "../Types/reportes";

function AppLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const lastReportStates = useRef<Record<number, string>>({});
    const initialLoad = useRef(true);
    const watcherStarted = useRef(false);

    useEffect(() => {
        let listener: any;

        try {
            listener = App.addListener("backButton", () => {
                if (location.pathname === "/" || location.pathname === "/inicio") {
                    return;
                }

                navigate(-1);
            });
        } catch (error) {
            console.warn("Capacitor App plugin no disponible", error);
        }

        return () => listener?.remove?.();
    }, [location.pathname, navigate]);

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval> | null = null;

        async function startReportNotificationWatcher() {
            if (watcherStarted.current) return;

            const storedUser = localStorage.getItem("user");
            if (!storedUser) return;

            let user;
            try {
                user = JSON.parse(storedUser);
            } catch {
                return;
            }

            if (!user || user.rol === "admin") return;

            const allowed = await requestNotificationPermission();
            if (!allowed) return;

            watcherStarted.current = true;

            async function checkReportUpdates() {
                try {
                    const reportes = await getMisReportes();
                    const states: Record<number, string> = {};
                    let updated = false;

                    reportes.forEach((reporte: Reporte) => {
                        const previousState = lastReportStates.current[reporte.id];
                        states[reporte.id] = reporte.estado;

                        if (!initialLoad.current && previousState && previousState !== reporte.estado) {
                            updated = true;
                            const estadoLabel = reporte.estado === "resuelto"
                                ? "Resuelto"
                                : reporte.estado === "en_revision"
                                    ? "En revisión"
                                    : "Pendiente";

                            sendLocalNotification(
                                "Estado del reporte actualizado",
                                `Tu reporte \"${reporte.titulo}\" ahora está ${estadoLabel}.`
                            );
                        }
                    });

                    if (updated) {
                        window.dispatchEvent(new Event("reportesUpdated"));
                    }

                    lastReportStates.current = states;
                    initialLoad.current = false;
                } catch (error) {
                    console.warn("Error revisando actualizaciones de reportes", error);
                }
            }

            await checkReportUpdates();
            intervalId = setInterval(checkReportUpdates, 2000);
        }

        startReportNotificationWatcher();

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
            watcherStarted.current = false;
        };
    }, [location.pathname]);
    
    // Rutas que deben mostrar BottomNav
    const showBottomNav = ["/inicio", "/crear-reporte", "/mis-reportes", "/perfil"].includes(location.pathname);
    
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/register" element={<SignUp />}/>
                <Route path="/inicio" element={<Inicio />}/>
                <Route path="/crear-reporte" element={<CrearReporte />}/>
                <Route path="/mis-reportes" element={<MisReportes />}/>
                <Route path="/admin/publicaciones" element={<AdminPublicaciones />}/>
                <Route path="/editar-reporte/:id" element={<EditarReporte />}/>
                <Route path="/perfil" element={<Perfil />} />
            </Routes>
            {showBottomNav && <BottomNav />}
        </>
    );
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <AppLayout />
        </BrowserRouter>
    );
}