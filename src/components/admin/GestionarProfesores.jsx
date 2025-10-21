import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GestionarProfesores.css";

export function GestionarProfesores() {
  const navigate = useNavigate();
  const [profesores, setProfesores] = useState([]);
  const [id_profesor, setId_profesor] = useState("");
  const [del, setDelete] = useState(false);
  const [mostrarModal, setmostrarModal] = useState(false);

  const handleClickAlu = () => navigate("../administrador/gestionarAlumnos");
    const handleClickProf = () => navigate("../administrador/gestionarProfesores");
    const handleClickCursos = () => navigate("../administrador/gestionarCursos");
    const handleClickadmin = () => navigate("/administrador");
  const handleRegistrarProf = () => navigate("registrarProfesor");
  const handleClickEdit = (id) => navigate(`editarProfesor/${id}`);
  const handleClickDelete = () => setDelete(true);

  const handleAbrirModal = (id) => {
    setmostrarModal(true);
    setId_profesor(id);
  };

  const handleCerrarModal = () => setmostrarModal(false);

  useEffect(() => {
    fetch("http://localhost:4000/ObtenerProfesores", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProfesores(data.profesores || []))
      .catch((err) => console.error("Error al obtener los profesores:", err));
  }, []);

  useEffect(() => {
    if (del) {
      fetch(`http://localhost:4000/EliminarProfesor/${id_profesor}`, {
        credentials: "include",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("Profesor eliminado correctamente");
            setProfesores((prev) => prev.filter((p) => p.id !== id_profesor));
            setmostrarModal(false);
          } else {
            alert("Error al eliminar el profesor");
          }
        })
        .catch((err) => console.error("Error al eliminar el profesor:", err));
      setDelete(false);
    }
  }, [del]);

  return (
    <div className="layout">
      {/* PANEL LATERAL */}
      <aside className="sidebar">
        <div className="logo">
            <img src="/ipn.png" alt="Logo" className="logo-img" />
            <span>Gestión Escolar</span>
        </div>
        <nav className="menu">
          <button onClick={() => navigate("/administrador")} className="menu-item">Panel de Control</button>
          <button onClick={handleClickAlu} className="menu-item">Estudiantes</button>
          <button onClick={handleClickProf} className="menu-item active">Profesores</button>
          <button onClick={handleClickCursos} className="menu-item">Cursos</button>
          <button className="menu-item">Informes</button>
        </nav>
        <button className="cerrar-sesion">⎋ Cerrar Sesión</button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="contenido">
        <header className="encabezado">
          <h1>Profesores</h1>
          <div className="acciones">
            <button className="btn azul" onClick={handleRegistrarProf}>+ Registrar nuevo profesor</button>
            
          </div>
        </header>

        {/* TABLA */}
        <div className="tabla-contenedor">
          <div className="tabla-header">
            <h2>Lista de Profesores</h2>
            <input type="text" placeholder="Buscar profesor..." />
          </div>

          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Correo Institucional</th>
                <th>Grado</th>
                <th>Situación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {profesores.length > 0 ? (
                profesores.map((profesor) => (
                  <tr key={profesor.id}>
                    <td>{profesor.id}</td>
                    <td>{profesor.nombre} {profesor.ape_paterno} {profesor.ape_materno}</td>
                    <td>{profesor.email}</td>
                    <td>{profesor.grado}</td>
                    <td>{profesor.situacion}</td>
                    <td>
                      <button className="icono editar" onClick={() => handleClickEdit(profesor.id)}>✎</button>
                      <button className="icono eliminar" onClick={() => handleAbrirModal(profesor.id)}>🗑</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6">No hay profesores disponibles</td></tr>
              )}
            </tbody>
          </table>

          <div className="tabla-footer">
            <button className="btn-descargar">Descargar Listado</button>
            <div className="paginacion">
              <button>Anterior</button>
              <span className="pagina-activa">1</span>
              <button>Siguiente</button>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>¿Estás seguro?</h3>
              <p>Esta acción no se puede deshacer.</p>
              <div className="modal-botones">
                <button className="btn rojo" onClick={handleClickDelete}>Confirmar</button>
                <button className="btn gris" onClick={handleCerrarModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
