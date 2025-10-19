import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function GestionarCursos() {
    const [datos, setDatos] = useState([]);
    const [id_datos, setId_datos] = useState("");
    const [del, setDelete] = useState(false);
    const [mostrarModal, setmostrarModal] = useState(false);
    const navigate = useNavigate();
    const handleClickCur = () => {
        navigate("registrarCurso");
    }

    useEffect(() => {
        fetch("http://localhost:4000/ObtenerCursos", { credentials: "include", })
            .then((res) => res.json())
            .then((data) => setDatos(data.cursos))
            .catch((err) => console.error("Error al obtener los cursos:", err));
    }, []);

    const handleEdit = (id) => {
        navigate(`editarCurso/${id}`);
    }
    const handleClickDis = (id) => {
        navigate(`distribucionHorarios/${id}`);
    }

    const handleClickDelete = () => {
        setDelete(true);
    }
    const handleAbrirModal = (id) => {
        setmostrarModal(true);
        setId_datos(id);
    }
    const handleCerrarModal = () => {
        setmostrarModal(false);
    }
    useEffect(() => {
        if (del) {
            fetch(`http://localhost:4000/EliminarCurso/${id_datos}`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert("Grupo eliminado correctamente");
                        setmostrarModal(false)
                    }
                    else {
                        alert("Error al eliminar el grupo");
                    }
                })
                .catch(err => console.error("Error al eliminar el grupo:", err));
        }
        setDelete(false);
    });
    return (
        <section>
            <h1>Gestionar Cursos</h1>
            <button onClick={handleClickCur}>Registrar Grupo</button>
            <button>Importar csv</button>
            <table border="1" cellPadding={5}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Profesor</th>
                        <th>Unidad de Aprendizaje</th>
                        <th>Turno</th>
                        <th>Carrera</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.map((dato) => (
                        <tr key={dato.id}>
                            <td>{dato.nombre}</td>
                            <td>{dato.DatosPersonale.nombre} {dato.DatosPersonale.ape_paterno} {dato.DatosPersonale.ape_materno}</td>
                            <td>{dato.Unidad_Aprendizaje.nombre}</td>
                            <td>{dato.turno}</td>
                            <td>{dato.Unidad_Aprendizaje.carrera}</td>
                            <td>
                                <button onClick={() => handleEdit(dato.id)}>Editar</button>
                                <button onClick={() => handleAbrirModal(dato.id)}>Eliminar</button>
                                <button onClick={() => handleClickDis(dato.id)}>Gestionar distribucion</button>
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