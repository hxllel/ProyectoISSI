import React, { useEffect, useState } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import Modal from "../admin/Modal.jsx";

export function Inscripcion() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [grupos, setGrupos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [id_dis, setId_dis] = useState("");
    const [distri, setDistri] = useState([]);
    const [gruposagg, setGruposagg] = useState([]);
    const [creditos, setCreditos] = useState([]);


    useEffect(() => {

        fetch(`http://localhost:4000/Grupos/${id}`, { credentials: "include", })
            .then(res => res.json())
            .then(data => {
                if (data.grupos) setGrupos(data.grupos);
                if (data.creditos) setCreditos(data.creditos)
            })
            .catch(err => console.error("Error al obtener los grupos:", err));
    }, []);


    const handleClickAbrir = (id) => {
        setModalOpen(true);
        setId_dis(id);

    }



    useEffect(() => {
        if (modalOpen) {
            fetch(`http://localhost:4000/ObtenerDist/${id_dis}`, { credentials: "include", })
                .then(res => res.json())
                .then(data => {
                    if (data.Distri) setDistri(data.Distri);
                }
                )
                .catch(err => console.error("Error la distribucion de horas del grupo:", err));
        }
    }, [modalOpen, id_dis]);

    const handleClickAdd = (id) => {

        fetch(`http://localhost:4000/Agregar/${id}`, { credentials: "include", method: "POST" })
            .then(res => res.json()).
            then(data => {
                if (data.success) {
                    alert("Se ha agregado la materia a tu horario");
                    setGruposagg(data.tempGrupo);
                    setCreditos(data.creditos);


                }
                else {
                    if (data.err) {
                        alert("No se ha podido agregar a tu horario, ", data.err);

                    }
                }
            }).catch(err => console.error("Error: ", err));

    };

    const handleClickEl = (id) => {
        fetch(`http://localhost:4000/Del/${id}`, { credentials: "include", method: "POST" })
            .then(res => res.json()).
            then(data => {
                if (data.success) {
                    alert("Se ha eliminado la materia a tu horario");
                    setGruposagg(data.tempGrupo);
                    setCreditos(data.creditos);

                }
                else {
                    alert("No se ha podido eliminar a tu horario");
                }
            }).catch(err => console.error("Error: ", err));

    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        const res = await fetch(`http://localhost:4000/Inscribirse`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },

        }).then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Se ha inscrito satisfactoriamente");
                    navigate(`/alumno/${id}`);

                }
                else {
                    alert("Ha ocurrido un error");
                }
            })
    }

    return (<section>

        <button>Importar del borrador</button>

        <h1>Grupos disponibles</h1>
        <table border="1" cellPadding={5}>
            <thead>
                <tr>
                    <th>Grupo</th>
                    <th>Unidad de Aprendizaje</th>
                    <th>Creditos Necesarios</th>
                    <th>Profesor</th>
                    <th>Disponibilidad</th>
                    <th>Cupos Disponibles</th>
                    <th>Accion</th>
                </tr>
            </thead>
            <tbody>
                {grupos.length > 0 ? (
                    grupos.map((grupo) => (
                        <tr key={grupo.id}>
                            <td>{grupo.nombre}</td>
                            <td>{grupo.Unidad_Aprendizaje.nombre}</td>
                            <td>{grupo.Unidad_Aprendizaje.credito}</td>
                            <td>{grupo.DatosPersonale.nombre} {grupo.DatosPersonale.ape_paterno} {grupo.DatosPersonale.ape_materno}</td>
                            <td>{grupo.cupo > 0 ? "Disponible" : "Lleno"}</td>
                            <td>{grupo.cupo}</td>
                            <td>
                                <button onClick={() => { handleClickAdd(grupo.id) }} disabled={grupo.cupo <= 0 || gruposagg.includes(grupo.id)}>Seleccionar</button>
                                <button onClick={() => { handleClickAbrir(grupo.id) }}>Mostrar Horario</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7">No hay grupos disponibles</td>
                    </tr>
                )}
            </tbody>
        </table>

        <h1>Grupos seleccionados</h1>
        <h2>Creditos restantes {creditos}</h2>
        <table border="1" cellPadding={5}>
            <thead>
                <tr>
                    <th>Grupo</th>
                    <th>Unidad de Aprendizaje</th>
                    <th>Creditos Necesarios</th>
                    <th>Profesor</th>
                    <th>Disponibilidad</th>
                    <th>Cupos Disponibles</th>
                    <th>Accion</th>
                </tr>
            </thead>
            <tbody>
                {gruposagg.length > 0 ? (
                    grupos.filter((grupo) => gruposagg.includes(grupo.id)).map((grupo) => (
                        <tr key={grupo.id}>
                            <td>{grupo.nombre}</td>
                            <td>{grupo.Unidad_Aprendizaje.nombre}</td>
                            <td>{grupo.Unidad_Aprendizaje.credito}</td>
                            <td>{grupo.DatosPersonale.nombre} {grupo.DatosPersonale.ape_paterno} {grupo.DatosPersonale.ape_materno}</td>
                            <td>{grupo.cupo > 0 ? "Disponible" : "Lleno"}</td>
                            <td>{grupo.cupo}</td>
                            <td>
                                <button onClick={() => { handleClickEl(grupo.id) }}>Eliminar de la seleccion</button>

                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7">No hay grupos seleccionados</td>
                    </tr>
                )}
            </tbody>
        </table>
        <form className="formulario" onSubmit={handleSubmit}>
            <button type="submit">Realizar inscripcion</button>
        </form>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} >
            <h2>Horario del Grupo</h2>

            <table>
                <thead>
                    <tr>
                        <th>Lunes</th>
                        <th>Martes</th>
                        <th>Miércoles</th>
                        <th>Jueves</th>
                        <th>Viernes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {distri
                                .filter(dis => dis.dia === "Lunes")
                                .map((dis, i) => (
                                    <div key={i}>
                                        {dis.hora_ini} - {dis.hora_fin}
                                    </div>
                                ))}
                        </td>

                        <td>
                            {distri
                                .filter(dis => dis.dia === "Martes")
                                .map((dis, i) => (
                                    <div key={i}>
                                        {dis.hora_ini} - {dis.hora_fin}
                                    </div>
                                ))}
                        </td>

                        <td>
                            {distri
                                .filter(dis => dis.dia === "Miércoles")
                                .map((dis, i) => (
                                    <div key={i}>
                                        {dis.hora_ini} - {dis.hora_fin}
                                    </div>
                                ))}
                        </td>

                        <td>
                            {distri
                                .filter(dis => dis.dia === "Jueves")
                                .map((dis, i) => (
                                    <div key={i}>
                                        {dis.hora_ini} - {dis.hora_fin}
                                    </div>
                                ))}
                        </td>

                        <td>
                            {distri
                                .filter(dis => dis.dia === "Viernes")
                                .map((dis, i) => (
                                    <div key={i}>
                                        {dis.hora_ini} - {dis.hora_fin}
                                    </div>
                                ))}
                        </td>
                    </tr>
                </tbody>
            </table>

        </Modal>



    </section>);
}