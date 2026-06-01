import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../Pages/Login";
import Inicio from "../Pages/Inicio";
import SignUp from "../Pages/SignUp";
import CrearReporte from "../Pages/CrearReporte";
import MisReportes from "../Pages/MisReportes";
import EditarReporte from "../Pages/EditarReporte";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/inicio" element={<Inicio />}/>
                <Route path="/register" element={<SignUp />}/>
                <Route path="/crear-reporte" element={<CrearReporte />}/>
                <Route path="/mis-reportes" element={<MisReportes />}/>
                <Route path="/editar-reporte/:id" element={<EditarReporte />}/>
            </Routes>
        </BrowserRouter>
    );
}