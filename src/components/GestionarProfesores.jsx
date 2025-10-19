import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export function GestionarProfesores() {
    const navigate = useNavigate();
    const [profesores, setProfesores] = useState([]);
    const [id_profesor, setId_profesor] = useState("");
    const [del, setDelete] = useState(false);
    const [mostrarModal, setmostrarModal] = useState(false);

    const handleClickProf = () => {
        navigate("registrarProfesor");
    }

    const handleClickEdit = (id) => {
        navigate(`editarProfesor/${id}`);
    }

    const handleClickDelete = () => {
        setDelete(true);
    }
    const handleAbrirModal = (id) => {
        setmostrarModal(true);
        setId_profesor(id);
    }
    const handleCerrarModal = () => {
        setmostrarModal(false);
    }

    useEffect(() => {
        fetch("http://localhost:4000/ObtenerProfesores", {
            credentials: "include"
        }
        )
            .then((res) => res.json())
            .then((data) => setProfesores(data.profesores))
            .catch((err) => console.error("Error al obtener los profesores:", err));
    }, []);

    useEffect(() => {
        if (del) {
            fetch(`http://localhost:4000/EliminarProfesor/${id_profesor}`, {
                credentials: "include",
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert("Profesor eliminado correctamente");
                        setmostrarModal(false)
                    }
                    else {
                        alert("Error al eliminar el profesor");
                    }
                })
                .catch(err => console.error("Error al eliminar el profesor:", err));
        }
        setDelete(false);
    });
    return (
        <section>
            <h1>Gestionar Profesores</h1>
            <button onClick={handleClickProf}>Registrar Profesor</button>
            <table border="1" cellPadding={5}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Grado</th>
                        <th>Situacion</th>
                        <th>Acciones</th>

                    </tr>
                </thead>
                <tbody>
                    {profesores.map((profesor) => (
                        <tr key={profesor.id}>
                            <td>{profesor.id}</td>
                            <td>{profesor.nombre} {profesor.ape_paterno} {profesor.ape_materno}</td>
                            <td>{profesor.email}</td>
                            <td>{profesor.grado}</td>
                            <td>{profesor.situacion}</td>
                            <td>
                                <button onClick={() => handleClickEdit(profesor.id)}>Editar</button>
                                <button onClick={() => handleAbrirModal(profesor.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {mostrarModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            background: "white",
                            padding: "20px",
                            borderRadius: "10px",
                            width: "300px",
                            textAlign: "center",
                        }}
                    >
                        <h3>¿Estás seguro?</h3>
                        <p>Esta acción no se puede deshacer.</p>
                        <div style={{ marginTop: "20px" }}>
                            <button
                                onClick={handleClickDelete}
                                style={{
                                    marginRight: "10px",
                                    background: "#e74c3c",
                                    color: "white",
                                    padding: "8px 16px",
                                }}
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={handleCerrarModal}
                                style={{
                                    background: "#95a5a6",
                                    color: "white",
                                    padding: "8px 16px",
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </section>

    )
}