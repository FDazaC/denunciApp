import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../Pages/Login";
import Inicio from "../Pages/Inicio";
import SignUp from "../Pages/SignUp";
export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/inicio" element={<Inicio />}/>
                <Route path="/register" element={<SignUp />}/>
            </Routes>
        </BrowserRouter>
    );
}