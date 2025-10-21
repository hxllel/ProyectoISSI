import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export function Alumno() {
    const navigate = useNavigate();
    const { id } = useParams();

    const handleIns = () => {
        navigate(`/alumno/inscripcion/${id}`);
    };

    return (
        <div>
            <h1>Alumno {id}</h1>
            <button onClick={handleIns}>Inscribirse</button>
        </div>
    );
}
