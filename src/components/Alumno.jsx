import React from "react";
import { useParams, useNavigate } from "react-router-dom";



export function Alumno() {
    const navigate = useNavigate();
    const { id } = useParams();

    const handleIns = () => {
        navigate(`/alumno/inscripcion/${id}`);
    };
    const handlePerfil = () => navigate(`/alumno/${id}/perfil`);
    return (
        <div>
            <h1>Alumno {id}</h1>
            <button onClick={handleIns}>Inscribirse</button>
             <button onClick={handlePerfil} style={{ marginLeft: "10px" }}>Mi Perfil</button>
        </div>
    );
}
