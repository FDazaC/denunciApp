import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "../Pages/Login";
import Inicio from "../Pages/Inicio";
import SignUp from "../Pages/SignUp";
import CrearReporte from "../Pages/CrearReporte";
import MisReportes from "../Pages/MisReportes";
import EditarReporte from "../Pages/EditarReporte";
import Perfil from "../Pages/Perfil"
import BottomNav from "../Components/BottomNav";

function AppLayout() {
    const location = useLocation();
    
    // Rutas que deben mostrar BottomNav
    const showBottomNav = ["/inicio", "/crear-reporte", "/mis-reportes", "/perfil"].includes(location.pathname);
    
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/register" element={<SignUp />}/>
                <Route path="/inicio" element={<Inicio />}/>
                <Route path="/crear-reporte" element={<CrearReporte />}/>
                <Route path="/mis-reportes" element={<MisReportes />}/>
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