import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function Alumno() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [showHorarios, setShowHorarios] = useState(false);

    const handleIns = () => {
        navigate(`/alumno/inscripcion/${id}`);
    };

    return (
        <div>
            <h1>Alumno {id}</h1>
            <div style={{ marginTop: 8 }}>
                <button onClick={handleIns}>Inscribirse</button>
                <button style={{ marginLeft: 8 }} onClick={() => navigate(`/alumno/horarios/${id}`)}>Ver Horarios</button>
            </div>

        </div>
    );
}
