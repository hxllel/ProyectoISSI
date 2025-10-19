import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function EditarAlumnos() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [alumno, setAlumno] = useState({
        nombre: "",
        ape_paterno: "",
        ape_materno: "",
        fecha_nacimiento: "",
        tipo_sangre: "",
        CURP: "",
        nacionalidad: "",
        calle: "",
        num_exterior: "",
        num_interior: "",
        codigo_postal: "",
        colonia: "",
        delegacion: "",
        ciudad: "",
        telefono: "",
        email: "",
        carrera: ""
    });

    const [carreras, setCarreras] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:4000/ObtenerAlumno/${id}`, { credentials: "include", })
            .then(res => res.json())
            .then(data => {
                if (data.alumno) setAlumno(data.alumno);
            })
            .catch(err => console.error("Error al obtener el alumno:", err));
    }, [id]);

    useEffect(() => {
        fetch("http://localhost:4000/ObtenerCarreras")
            .then(res => res.json())
            .then(data => setCarreras(data.carreras || []))
            .catch(err => console.error("Error al obtener las carreras:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAlumno(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`http://localhost:4000/EditarAlumno/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alumno),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Alumno editado con éxito");
                    navigate("/administrador/gestionarAlumnos");
                } else {
                    alert("Error al editar el alumno");
                }
            })
            .catch(err => console.error("Error al editar el alumno:", err));
    };

    return (
        <section>
            <h1>Editar Alumno</h1>
            <form className="formulario" onSubmit={handleSubmit}>
                <label>Nombre:</label>
                <input type="text" name="nombre" value={alumno.nombre} onChange={handleChange} />
                <label>Apellido Paterno:</label>
                <input type="text" name="ape_paterno" value={alumno.ape_paterno} onChange={handleChange} />
                <label>Apellido Materno:</label>
                <input type="text" name="ape_materno" value={alumno.ape_materno} onChange={handleChange} />
                <label>Fecha de Nacimiento:</label>
                <input type="date" name="fecha_nacimiento" value={alumno.fecha_nacimiento} onChange={handleChange} />
                <label>Tipo de Sangre:</label>
                <input type="text" name="tipo_sangre" value={alumno.tipo_sangre} onChange={handleChange} />
                <label>CURP:</label>
                <input type="text" name="CURP" value={alumno.CURP} onChange={handleChange} />
                <label>Nacionalidad:</label>
                <input type="text" name="nacionalidad" value={alumno.nacionalidad} onChange={handleChange} />
                <label>Calle:</label>
                <input type="text" name="calle" value={alumno.calle} onChange={handleChange} />
                <label>Número Exterior:</label>
                <input type="text" name="num_exterior" value={alumno.num_exterior} onChange={handleChange} />
                <label>Número Interior:</label>
                <input type="text" name="num_interior" value={alumno.num_interior} onChange={handleChange} />
                <label>Código Postal:</label>
                <input type="text" name="codigo_postal" value={alumno.codigo_postal} onChange={handleChange} />
                <label>Colonia:</label>
                <input type="text" name="colonia" value={alumno.colonia} onChange={handleChange} />
                <label>Delegación:</label>
                <input type="text" name="delegacion" value={alumno.delegacion} onChange={handleChange} />
                <label>Ciudad:</label>
                <input type="text" name="ciudad" value={alumno.ciudad} onChange={handleChange} />
                <label>Teléfono:</label>
                <input type="text" name="telefono" value={alumno.telefono} onChange={handleChange} />
                <label>Correo Electrónico:</label>
                <input type="email" name="email" value={alumno.email} onChange={handleChange} />

                <label>Carrera:</label>
                <select
                    name="carrera"
                    value={alumno.carrera || ""}
                    onChange={handleChange}
                >
                    <option value="">Seleccione una carrera</option>
                    {carreras.map((c) => (
                        <option key={c.nombre} value={c.nombre}>
                            {c.nombre}
                        </option>
                    ))}
                </select>

                <button type="submit">Editar Alumno</button>
            </form>
        </section>
    );
}
