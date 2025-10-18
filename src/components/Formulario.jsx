import "./Formulario.css";
import { useState } from "react";

export function Formulario({ setSuccess }) {
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState(false);
    const [error2, setError2] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (usuario === "" || contrasena === "") {
            setError(true);
            setError2(false);
            return;
        }

        setError(false);

        try {
            const res = await fetch("http://localhost:4000/IniciarSesion", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ usuario, contrasena, remember: true }),
            });

            const text = await res.text();
            console.log("respuesta del servidor:", text);

            let data;
            try {
                data = JSON.parse(text);
            } catch (error) {
                console.error("No es JSON válido:", error);
            }

            if (data?.success) {
                const tip = data.nivel_acceso;
                setSuccess(tip);
            } else {
                setError2(true);
            }
        } catch (err) {
            console.error("Error al conectar con el servidor:", err);
            setError2(true);
        }
    };

    return (
        <div className="login-layout">
            {/* Logos laterales */}
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
                        <label htmlFor="usuario">Usuario</label>
                        <input
                            id="usuario"
                            type="text"
                            placeholder="Escribe tu usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
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

                    {error && (
                        <p className="alert alert-warn">Todos los campos son obligatorios</p>
                    )}
                    {error2 && (
                        <p className="alert alert-error">
                            Usuario o contraseña incorrectos
                        </p>
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
