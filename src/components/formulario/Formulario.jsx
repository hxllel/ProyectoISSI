import "./Formulario.css";
import { useState } from "react";

export function Formulario({ setSuccess, setId2 }) {
    const [id, setId] = useState(""); // Cambiado de 'usuario' a 'id'
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // Para mensajes de error del backend

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (id === "" || contrasena === "") {
            setError(true);
            setErrorMessage("Todos los campos son obligatorios");
            return;
        }

        setError(false);
        setErrorMessage("");

        try {
            const res = await fetch("http://localhost:4000/IniciarSesion", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, contrasena, remember: true }), // Enviar 'id' en lugar de 'usuario'
            });

            const data = await res.json(); // La respuesta ya es JSON
            console.log("Respuesta del servidor:", data);

            if (data.success) {
                const tip = data.tipo_usuario;
                const userId = data.id;
                setId2(userId);
                setSuccess(tip);
            } else {
                setErrorMessage(data.message || "Usuario o contraseña incorrectos");
            }
        } catch (err) {
            console.error("Error al conectar con el servidor:", err);
            setErrorMessage("Error al conectar con el servidor");
        }
    };

    return (
        <div className="login-layout">
            <aside className="brand-left">
                <img src="/ipn.png" alt="IPN" />
            </aside>

            <main className="login-card">
                <header className="center">
                    <h1>Iniciar sesión</h1>
                    <p className="muted">Accede con tu usuario y contraseña</p>
                </header>

                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="id">Usuario</label> {/* Cambiado de 'usuario' a 'id' */}
                        <input
                            id="id"
                            type="text"
                            placeholder="Escribe tu ID"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contrasena">Contraseña</label>
                        <input
                            id="contrasena"
                            type="password"
                            placeholder="••••••••"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    {(error || errorMessage) && (
                        <p className="alert alert-error">{errorMessage}</p>
                    )}

                    <button type="submit" className="btn">
                        Entrar
                    </button>
                </form>
            </main>

            <aside className="brand-right">
                <img src="/escom.png" alt="ESCOM" />
            </aside>
        </div>
    );
}