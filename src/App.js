import './App.css';
import { useState } from 'react';
import { Formulario } from './components/Formulario';
import { Alumno } from './components/Alumno';
import { Administrador } from './components/Administrador';
import { Profesor } from './components/Profesor';

function App() {
  const [success, setSuccess] = useState(""); // "" en lugar de []

  let contenido;

  if (!success) {
    contenido = <Formulario setSuccess={setSuccess} />;
  } else if (success === "alumno") {
    contenido = <Alumno />;
  } else if (success === "administrador") {
    contenido = <Administrador />;
  } else if (success === "profesor") {
    contenido = <Profesor />;
  } else {
    contenido = <p>Tipo de usuario no reconocido.</p>;
  }

  return <div className="App">{contenido}</div>;
}

export default App;
