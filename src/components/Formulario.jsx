import "./Formulario.css"
import { useState } from "react";
import { Alumno } from "./Alumno"
import { Profesor } from "./Profesor"
import { Administrador } from "./Administrador"


export function Formulario({ setSuccess }) {
    const [usuario, setUsuario] = useState("")

    const [contrasena, setContrasena] = useState("")

    const [error, setError] = useState(false)

    const [error2, setError2] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (usuario === "" || contrasena === "") {
            setError(true)
            return
        }

        const res = await fetch("http://localhost:4000/IniciarSesion", {

            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ usuario, contrasena, remember: true }),

        });
        const text = await res.text();
        console.log("respuesta del servidor: ", text);
        let data;
        try {
            data = JSON.parse(text);
            console.log(data);
        }
        catch (error) {
            console.error("No es JSON valido: ", error);
        }

        if (data.success) {
            const tip = data.nivel_acceso
            setSuccess(tip)
        }
        else {
            setError2(true)
            return
        }
    }
    return (
        <section>
            <h1>Login</h1>

            <form className="formulario" onSubmit={handleSubmit}>

                <input type="text" value={usuario} onChange={e => setUsuario(e.target.value)} />
                <input type="password" value={contrasena} onChange={e => setContrasena(e.target.value)} />

                <button type="submit">Iniciar Sesion</button>
            </form>
            {error && <p>Todos los campos son obligatorios</p>}
            {error2 && <p>No existe el usuario o la contraseña es incorrecta</p>}
        </section>
    );
}