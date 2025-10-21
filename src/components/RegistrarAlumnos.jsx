import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function RegistrarAlumnos() {

    const [id, setId] = useState("");
    const [nombre, setNombre] = useState("")
    const [apellido_p, setApellido_p] = useState("")
    const [apellido_m, setApellido_m] = useState("")
    const [fecha_nacimiento, setFecha_nacimiento] = useState("")
    const [tipo_sangre, setTipo_sangre] = useState("")
    const [CURP, setCURP] = useState("")
    const [nacionalidad, setNacionalidad] = useState("")
    const [calle, setCalle] = useState("")
    const [numero_ex, setNumero_ex] = useState("")
    const [numero_in, setNumero_in] = useState("")
    const [codigo_postal, setCodigo_postal] = useState("")
    const [colonia, setColonia] = useState("")
    const [delegacion, setDelegacion] = useState("")
    const [ciudad, setCiudad] = useState("")
    const [telefono, setTelefono] = useState("")
    const [correo, setCorreo] = useState("")
    const [creditos_disponibles, setCreditos_disponibles] = useState(0)
    const [foto, setFoto] = useState(null);
    const [error2, setError2] = useState(false);
    const [carreras, setCarreras] = useState([]);
    const [carreraSeleccionada, setCarreraSeleccionada] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        fetch("http://localhost:4000/ObtenerCarreras", { credentials: "include", })
            .then((res) => res.json())
            .then((data) => {
                console.log("Datos recibidos:", data);
                setCarreras(data.carreras || []);
            })
            .catch((err) => console.error("Error al obtener las carreras:", err));
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (nombre === "" || apellido_p === "" || apellido_m === "" || fecha_nacimiento === "" || tipo_sangre === "" || CURP === "" || nacionalidad === "" || calle === "" || numero_ex === "" || numero_in === "" || codigo_postal === "" || colonia === "" || delegacion === "" || ciudad === "" || telefono === "" || correo === "") {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const res = await fetch("http://localhost:4000/RegistrarAlumno", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, nombre, apellido_p, apellido_m, fecha_nacimiento, tipo_sangre, CURP, nacionalidad, calle, numero_ex, numero_in, codigo_postal, colonia, delegacion, ciudad, telefono, correo, carreraSeleccionada }),
        });
        if (res.ok) {
            alert("Alumno registrado correctamente");
            navigate(`/administrador/gestionarAlumnos`)
        } else {
            const error = await res.text();
            alert("Error: " + error);
        }


    }

    return (


        <section>

            <h1>Registrar Alumnos</h1>
            <form className="formulario" onSubmit={handleSubmit}>
                <label>Boleta:</label>
                <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
                <label>Nombre:</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <label>Apellido Paterno:</label>
                <input type="text" value={apellido_p} onChange={(e) => setApellido_p(e.target.value)} />
                <label>Apellido Materno:</label>
                <input type="text" value={apellido_m} onChange={(e) => setApellido_m(e.target.value)} />
                <label>Fecha de Nacimiento:</label>
                <input type="date" value={fecha_nacimiento} onChange={(e) => setFecha_nacimiento(e.target.value)} />
                <label>Tipo de Sangre:</label>
                <input type="text" value={tipo_sangre} onChange={(e) => setTipo_sangre(e.target.value)} />
                <label>CURP:</label>
                <input type="text" value={CURP} onChange={(e) => setCURP(e.target.value)} />
                <label>Nacionalidad:</label>
                <input type="text" value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} />
                <label>Calle:</label>
                <input type="text" value={calle} onChange={(e) => setCalle(e.target.value)} />
                <label>Número Exterior:</label>
                <input type="text" value={numero_ex} onChange={(e) => setNumero_ex(e.target.value)} />
                <label>Número Interior:</label>
                <input type="text" value={numero_in} onChange={(e) => setNumero_in(e.target.value)} />
                <label>Código Postal:</label>
                <input type="text" value={codigo_postal} onChange={(e) => setCodigo_postal(e.target.value)} />
                <label>Colonia:</label>
                <input type="text" value={colonia} onChange={(e) => setColonia(e.target.value)} />
                <label>Delegación:</label>
                <input type="text" value={delegacion} onChange={(e) => setDelegacion(e.target.value)} />
                <label>Ciudad:</label>
                <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
                <label>Teléfono:</label>
                <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                <label>Correo Electrónico:</label>
                <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                <label>Carrera:</label>
                <select
                    value={carreraSeleccionada}
                    onChange={(e) => setCarreraSeleccionada(e.target.value)}
                >
                    <option value="">Seleccione una carrera</option>
                    {Array.isArray(carreras) &&
                        carreras.map((c) => (
                            <option key={c.id || c.nombre} value={c.nombre}>
                                {c.nombre}
                            </option>
                        ))}
                </select>

                <button type="submit">Registrar Alumno</button>
            </form>

        </section>
    );

}