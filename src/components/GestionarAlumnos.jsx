import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function GestionarAlumnos() {
    const [datos, setDatos] = useState([]);
    const navigate = useNavigate();
    const [del, setDelete] = useState(false);
    const [id_alumno, setId_alumno] = useState("");
    const [mostrarModal, setmostrarModal] = useState(false);
    const handleClickAlu = () => {
        navigate("registrarAlumno");
    };

    const handleClickEdit = (id) => {
        navigate(`editarAlumno/${id}`);
    };

    const handleClickDelete = () => {
        setDelete(true);
    }
    const handleAbrirModal = (id) => {
        setmostrarModal(true);
        setId_alumno(id);
    }
    const handleCerrarModal = () => {
        setmostrarModal(false);
    }


    useEffect(() => {
        fetch("http://localhost:4000/ObtenerAlumnos", { credentials: "include", })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log("Respuesta del servidor:", data);
                setDatos(data.alumnos || []);
            })
            .catch((err) => {
                console.error("Error al obtener alumnos:", err);
                setDatos([]);
            });
    }, []);

    useEffect(() => {
        if (del) {
            fetch(`http://localhost:4000/EliminarAlumno/${id_alumno}`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert("Alumno eliminado correctamente");
                        setmostrarModal(false)
                    } else {
                        alert("Error al eliminar el alumno");
                    }
                }).catch((err) => console.error("Error al eliminar el alumno:", err));

        }
        setDelete(false);
    });

    return (
        <section>
            <h1>Gestionar Alumnos</h1>
            <button onClick={handleClickAlu}>Registrar Alumno</button>

            <table border="1" cellPadding={5}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Carrera</th>
                        <th>Situacion</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.length > 0 ? (
                        datos.map((alumnos) => (
                            <tr key={alumnos.id}>
                                <td>{alumnos.id}</td>
                                <td>
                                    {alumnos.nombre} {alumnos.ape_paterno} {alumnos.ape_materno}
                                </td>
                                <td>{alumnos.email}</td>
                                <td>{alumnos.carrera}</td>
                                <td>{alumnos.situacion}</td>

                                <td>
                                    <button onClick={() => handleClickEdit(alumnos.id)}>Editar</button>
                                    <button onClick={() => handleAbrirModal(alumnos.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay alumnos disponibles</td>
                        </tr>
                    )}
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
    );
}