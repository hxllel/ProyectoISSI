import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function EditarProfesores() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [profesor, setProfesor] = useState({
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
        grado: "",

    });

    useEffect(() => {
        fetch(`http://localhost:4000/ObtenerProfesor/${id}`, { credentials: "include", })
            .then(res => res.json())
            .then(data => {
                if (data.profesor) setProfesor(data.profesor);
            })
            .catch(err => console.error("Error al obtener el profesor:", err));
    }, [id]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfesor(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`http://localhost:4000/EditarProfesor/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profesor),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Profesor editado correctamente");
                    navigate("/administrador/gestionarProfesores");
                } else {
                    alert("Error al editar el profesor");
                }
            }).catch(err => console.error("Error al editar el profesor:", err));
    };

    return (
        <section>
            <h1>Editar profesor</h1>
            <form className="formulario" onSubmit={handleSubmit}>
                <label>Nombre:</label>
                <input type="text" name="nombre" value={profesor.nombre} onChange={handleChange} />
                <label>Apellido Paterno:</label>
                <input type="text" name="ape_paterno" value={profesor.ape_paterno} onChange={handleChange} />
                <label>Apellido Materno:</label>
                <input type="text" name="ape_materno" value={profesor.ape_materno} onChange={handleChange} />
                <label>Fecha de Nacimiento:</label>
                <input type="date" name="fecha_nacimiento" value={profesor.fecha_nacimiento} onChange={handleChange} />
                <label>Tipo de Sangre:</label>
                <input type="text" name="tipo_sangre" value={profesor.tipo_sangre} onChange={handleChange} />
                <label>CURP:</label>
                <input type="text" name="CURP" value={profesor.CURP} onChange={handleChange} />
                <label>Nacionalidad:</label>
                <input type="text" name="nacionalidad" value={profesor.nacionalidad} onChange={handleChange} />
                <label>Calle:</label>
                <input type="text" name="calle" value={profesor.calle} onChange={handleChange} />
                <label>Número Exterior:</label>
                <input type="text" name="num_exterior " value={profesor.num_exterior} onChange={handleChange} />
                <label>Número Interior:</label>
                <input type="text" name="num_interior " value={profesor.num_interior} onChange={handleChange} />
                <label>Código Postal:</label>
                <input type="text" name="codigo_postal" value={profesor.codigo_postal} onChange={handleChange} />
                <label>Colonia:</label>
                <input type="text" name="colonia" value={profesor.colonia} onChange={handleChange} />
                <label>Delegación:</label>
                <input type="text" name="delegacion" value={profesor.delegacion} onChange={handleChange} />
                <label>Ciudad:</label>
                <input type="text" name="ciudad" value={profesor.ciudad} onChange={handleChange} />
                <label>Teléfono:</label>
                <input type="text" name="telefono" value={profesor.telefono} onChange={handleChange} />
                <label>Correo Electrónico:</label>
                <input type="email" name="email" value={profesor.email} onChange={handleChange} />
                <label>RFC:</label>
                <input type="text" name="RFC" value={profesor.RFC} onChange={handleChange} />
                <label>Grado:</label>
                <input type="text" name="grado" value={profesor.grado} onChange={handleChange} />

                <button type="submit">Guardar Cambios</button>
            </form>
        </section>
    );
}