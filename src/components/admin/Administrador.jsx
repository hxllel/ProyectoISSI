import React from "react";
import { useNavigate } from "react-router-dom";
import "./Administrador.css";
import { FaUserGraduate, FaChalkboardTeacher, FaBookOpen, FaTrashAlt, FaFileAlt, FaBullhorn } from "react-icons/fa";

export function Administrador() {
  const navigate = useNavigate();

  const handleClickAlu = () => navigate("gestionarAlumnos");
  const handleClickProf = () => navigate("gestionarProfesores");
  const handleClickCursos = () => navigate("gestionarCursos");

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
    <img src="ipn.png" alt="Logo" className="logo-img" />
    <span>Gestión Escolar</span>
  </div>
        <nav className="menu">
          <button onClick={() => navigate("/administrador")} className="menu-item active">
            Panel de Control
          </button>
          <button onClick={handleClickAlu} className="menu-item">Estudiantes</button>
          <button onClick={handleClickProf} className="menu-item">Profesores</button>
          <button onClick={handleClickCursos} className="menu-item">Cursos</button>
          <button className="menu-item">Informes</button>
        </nav>
        <button className="logout">Cerrar sesión</button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header>
          <h1>¡Hola, Administrador!</h1>
        </header>

        <section className="acciones-rapidas">
          <h2>Acciones Rápidas</h2>
          <div className="acciones-grid">
            <div className="card highlighted">
              <FaUserGraduate className="icon" />
              <h3>Gestión de Estudiantes</h3>
              <p>Añadir nuevos estudiantes al sistema con todos sus datos relevantes.</p>
              <button onClick={handleClickAlu}>Registrar</button>
            </div>

            <div className="card">
              <FaChalkboardTeacher className="icon" />
              <h3>Gestión de Profesores</h3>
              <p>Incorporar nuevos miembros del personal docente con sus calificaciones.</p>
              <button onClick={handleClickProf}>Registrar</button>
            </div>

            <div className="card">
              <FaBookOpen className="icon" />
              <h3>Gestión de Grupos</h3>
              <p>Crear y configurar nuevos programas y asignaturas.</p>
              <button onClick={handleClickCursos}>Añadir</button>
            </div>

            <div className="card">
              <FaTrashAlt className="icon" />
              <h3>Eliminar Cursos</h3>
              <p>Archivar o eliminar cursos existentes del plan de estudios.</p>
              <button>Eliminar</button>
            </div>

            <div className="card">
              <FaFileAlt className="icon" />
              <h3>Informes del Sistema</h3>
              <p>Generar y ver análisis detallados del uso del sistema.</p>
              <button>Ver Informes</button>
            </div>

            <div className="card">
              <FaBullhorn className="icon" />
              <h3>Publicar Noticia</h3>
              <p>Sube una noticia dirigida a la comunidad politécnica.</p>
              <button>Registrar</button>
            </div>
          </div>
        </section>

        <section className="estadisticas">
          <h2>Estadísticas Generales</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <p>Total de Estudiantes</p>
              <h3>1,250</h3>
            </div>
            <div className="stat-card">
              <p>Total de Profesores</p>
              <h3>85</h3>
            </div>
            <div className="stat-card">
              <p>Cursos Activos</p>
              <h3>32</h3>
            </div>
            <div className="stat-card">
              <p>Próximos Eventos</p>
              <h3>5</h3>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
