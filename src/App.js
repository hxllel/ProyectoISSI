import './App.css';
import { useState } from 'react';
import { Formulario } from './components/formulario/Formulario';
import { Alumno } from './components/alumno/Alumno';
import { Administrador } from './components/admin/Administrador';
import { Profesor } from './components/profesor/Profesor';
import { RegistrarAlumnos } from './components/admin/RegistrarAlumnos';
import {RegistrarProfesores} from './components/admin/RegistrarProfesores';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RegistrarCursos } from './components/admin/RegistrarCursos';
import { GestionarAlumnos } from './components/admin/GestionarAlumnos';
import { GestionarProfesores } from './components/admin/GestionarProfesores';
import { GestionarCursos } from './components/admin/GestionarCursos';
import { EditarAlumnos } from './components/admin/EditarAlumnos';
import { EditarProfesores } from './components/admin/EditarProfesores';
import { EditarGrupo } from './components/admin/EditarGrupo';
import { Distribucion } from './components/admin/Distribucion.jsx';
import { Inscripcion } from './components/alumno/Inscripcion.jsx';
function App() {
  const [success, setSuccess] = useState("");
  const [id2, setId2] = useState("");

  return (
    <div className='App'>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          !success ? (
            <Formulario setSuccess={setSuccess} setId2={setId2} />
          ) : success === "alumno" ? (
            <Navigate to={`/alumno/${id2}`} replace />
          ) : success === "administrador" ? (
              <Navigate to="/administrador" replace />
          ) : success === "profesor" ? (
             <Navigate to={`/profesor/${id2}`} replace />
          ) : (
            <p>Tipo de usuario no reconocido.</p>
          )
        } />
        <Route path="/alumno/:id" element={<Alumno />} />

        <Route path="/administrador" element={<Administrador />} />
        <Route path="/profesor" element={<Profesor />} />
        <Route path="administrador/gestionarCursos" element={<GestionarCursos />} />
        <Route path="administrador/gestionarCursos/registrarCurso" element={<RegistrarCursos />} />
        <Route path="administrador/gestionarProfesores/registrarProfesor" element={<RegistrarProfesores />} />
        <Route path="administrador/gestionarProfesores" element={<GestionarProfesores />} />
        <Route path="administrador/gestionarAlumnos" element={<GestionarAlumnos />} />
        <Route path="administrador/gestionarAlumnos/registrarAlumno" element={<RegistrarAlumnos />} />
        <Route path="administrador/admin/gestionarAlumnos/editarAlumno/:id" element={<EditarAlumnos />} />
        <Route path="administrador/gestionarProfesores/editarProfesor/:id" element={<EditarProfesores />} />
        <Route path="administrador/gestionarCursos/editarCurso/:id" element={<EditarGrupo />} />
        <Route path="administrador/gestionarCursos/distribucionHorarios/:id" element={<Distribucion />} />
        <Route path ="alumno/inscripcion/:id" element={<Inscripcion />} />
      </Routes>
    </BrowserRouter>
  </div>
    
    
  );
}

export default App;
