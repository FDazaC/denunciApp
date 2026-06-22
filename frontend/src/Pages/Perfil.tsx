import { useEffect, useState } from "react";
import {getProfile,updateProfile} from "../Services/users.service";
import Navbar from "../Components/NavBar";
import BackButton from "../Components/BackButton";
import "../Styles/Perfil.css"

export default function Perfil(){
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [rut, setRut] = useState("");
    const [rol, setRol] = useState("");

    useEffect(() => {
        async function cargarPerfil() {
            try {
                const data = await getProfile();
                
                setNombre(data.nombre);
                setEmail(data.email);
                setRut(data.rut);
                setRol(data.rol);
                
            } catch (error) {
                console.error(error);
            }
        }

        cargarPerfil();
    }, []);


    async function guardarCambios() {
        try {
            await updateProfile({
                nombre,
                email,
                rut,
            });

            alert("Perfil actualizado");

        } catch (error) {
            console.error(error);
            alert("Error al actualizar perfil");
        }
    }

    return (
        <div className="perfil-page">
            <Navbar />

            <div className="perfil-container">
                <div className="perfil-card">
                    <div className="perfil-avatar">
                        {nombre.charAt(0).toUpperCase()}
                    </div>

                    <h1>Mi Perfil</h1>

                    <div className="perfil-form">
                        <div className="perfil-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) =>
                                    setNombre(e.target.value)
                                }
                            />
                        </div>

                        <div className="perfil-group">
                            <label>Correo</label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />
                        </div>

                        <div className="perfil-group">
                            <label>RUT</label>

                            <input
                                type="text"
                                value={rut}
                                onChange={(e) =>
                                    setRut(e.target.value)
                                }
                            />
                        </div>

                        <div className="perfil-group">
                            <label>Rol</label>

                            <input
                                type="text"
                                value={rol}
                                disabled
                            />
                        </div>

                        <div className="perfil-buttons">

                            <BackButton
                                label="Volver"
                                to="/inicio"
                                className="btn-volver"
                            />

                            <button
                                className="btn-guardar"
                                onClick={guardarCambios}
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}