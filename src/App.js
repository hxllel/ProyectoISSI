import './App.css';
import { useState } from 'react';
import { Formulario } from './components/Formulario';
import { Alumno } from './components/Alumno';
import { Administrador } from './components/Administrador';
import { Profesor } from './components/Profesor';
import { RegistrarAlumnos } from './components/RegistrarAlumnos';
import {RegistrarProfesores} from './components/RegistrarProfesores';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RegistrarCursos } from './components/RegistrarCursos';
import { GestionarAlumnos } from './components/GestionarAlumnos';
import { GestionarProfesores } from './components/GestionarProfesores';
import { GestionarCursos } from './components/GestionarCursos';
import { EditarAlumnos } from './components/EditarAlumnos';
import { EditarProfesores } from './components/EditarProfesores';
import { EditarGrupo } from './components/EditarGrupo';
import { Distribucion } from './components/Distribucion';
import { Inscripcion } from './components/Inscripcion';
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
        <Route path="administrador/gestionarAlumnos/editarAlumno/:id" element={<EditarAlumnos />} />
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
