import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

export function Administrador() {
    const navigate = useNavigate();
    const handleClickAlu = () => {
        navigate('gestionarAlumnos');
    }
    const handleClickProf = () => {
        navigate('gestionarProfesores');
    }
    const handleClickCursos = () => {
        navigate('gestionarCursos');
    }
    return (
        <section>
            <div>
                <h1>Vista administrador</h1>
            </div>

            <button onClick={handleClickAlu}>Alumnos</button>
            <button onClick={handleClickProf}>Profesores</button>
            <button onClick={handleClickCursos}>Cursos</button>
            <button>Publicar Noticia</button>
            <button>Informes del sistema</button>
        </section>
    );
}
