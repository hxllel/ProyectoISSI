import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


export function EditarGrupo() {
    const { id } = useParams();
    const [profesores, setProfesores] = useState([]);
    const [id_profesor, setId_profesor] = useState("");
    const [UA, setUA] = useState([]);
    const [id_UA, setId_UA] = useState("");
    const [grupo, setGrupo] = useState({
        id_profesor: "",
        id_UA: "",
        turno: ""
    });
    const navigate = useNavigate();


    useEffect(() => {
        fetch("http://localhost:4000/ObtenerProfesores", { credentials: "include", })
            .then((res) => res.json())
            .then((data) => setProfesores(data.profesores))
            .catch((err) => console.error("Error al obtener los profesores:", err));
    }, []);
    useEffect(() => {
        fetch("http://localhost:4000/ObtenerUA")
            .then((res) => res.json())
            .then((data) => setUA(data.UA))
            .catch((err) => console.error("Error al obtener los profesores:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGrupo(prev => ({ ...prev, [name]: value }));
    }
    useEffect(() => {
        fetch(`http://localhost:4000/ObtenerGrupo/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.grupo) setGrupo(data.grupo);
            })
            .catch(err => console.error("Error al obtener el grupo:", err));
    }, [id]);


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:4000/EditarGrupo/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(grupo),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Grupo editado correctamente");
                    navigate("/administrador/gestionarCursos");
                } else {
                    alert("Error al editar el grupo");
                }
            })
            .catch(err => console.error("Error al editar el grupo:", err));
    }

    return (
        <section>

            <h1>Editar Grupo</h1>
            <form className="formulario" onSubmit={handleSubmit}>
                <label>Nombre del grupo:</label>
                <input
                    type="text"
                    name="nombre"
                    value={grupo.nombre || ""}
                    onChange={handleChange}
                />
                <label>Profesor:</label>
                <select
                    value={grupo.id_prof}
                    onChange={handleChange} name="id_profesor"
                >
                    <option value="">Seleccione un profesor</option>
                    {profesores.map((profesor) => (
                        <option key={profesor.id} value={profesor.id}>
                            {profesor.nombre} {profesor.ape_paterno} {profesor.ape_materno}
                        </option>
                    ))}
                </select>

                <label>Unidad de Aprendizaje:</label>
                <select value={grupo.id_ua} onChange={handleChange} name="id_UA">
                    <option value={""}>Seleccione una unidad de aprendizaje</option>
                    {UA.map((ua) => (
                        <option key={ua.id} value={ua.id}>
                            {ua.nombre}
                        </option>
                    ))}
                </select>
                <label>Turno:</label>
                <select value={grupo.turno} onChange={handleChange} name="turno">
                    <option value="">Seleccione un turno</option>
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                </select>
                <button type="submit">Actualizar Curso</button>
            </form>
        </section>);
}