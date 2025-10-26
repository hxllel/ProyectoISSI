import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "./Modal";

export function Distribucion() {

    const [modalOpen, setModalOpen] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [dia, setDia] = useState("");
    const [hora_ini, setHora_ini] = useState("");
    const [hora_fin, setHora_fin] = useState("");
    const [del, setDelete] = useState(false);
    const [id_delete, setId_delete] = useState("");

    const [modalOpen2, setModalOpen2] = useState(false);


    const [Distri, setDistri] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();

    const handleHoraInicio = (e) => {
        const nuevaHoraIni = e.target.value;
        setHora_ini(nuevaHoraIni);

        // Si ya hay una hora de fin seleccionada, validar
        if (hora_fin && nuevaHoraIni >= hora_fin) {
            alert("La hora de inicio no puede ser mayor o igual que la hora de fin");
            setHora_ini("");
        }
    };

    const handleHoraFin = (e) => {
        const nuevaHoraFin = e.target.value;
        setHora_fin(nuevaHoraFin);

        // Si ya hay una hora de inicio seleccionada, validar
        if (hora_ini && nuevaHoraFin <= hora_ini) {
            alert("La hora de fin no puede ser menor o igual que la hora de inicio");
            setHora_fin("");
        }
    };

    useEffect(() => {
        fetch(`http://localhost:4000/ObtenerDist/${id}`, { credentials: "include", })
            .then(res => res.json())
            .then(data => {
                if (data.Distri) setDistri(data.Distri);
            })
            .catch(err => console.error("Error la distribucion de horas del grupo:", err));
    }, [id]);

    const enviarFormulario = (e) => {
        e.preventDefault();
        const res = fetch(`http://localhost:4000/AgregarDist/${id}`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_grupo: id, dia, hora_ini, hora_fin }),
        }).then(res => res.json()).then(data => {
            if (data.success) {
                setMensaje("Día agregado correctamente");
            } else {
                setMensaje("Error al agregar el día: " + data.message);
            }
        }).catch(err => console.error("Error al agregar el día:", err));

        setModalOpen(false);
    }

    const handleClickAbrir = (id) => {
        setModalOpen2(true);
        setId_delete(id);
    }
    const handleClickDelete = () => {
        setDelete(true);

    }
    useEffect(() => {
        if (del) {
            fetch(`http://localhost:4000/EliminarDist/${id_delete}`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert("Día eliminado correctamente");
                        setModalOpen2(false)
                    }
                    else {
                        alert("Error al eliminar el día");
                    }
                })
                .catch(err => console.error("Error al eliminar el día:", err));
            setDelete(false);
            setModalOpen2(false);
        }

    });


    return (
        <section>
            <h1>Distribucion del Grupo </h1>
            <button className="btn" onClick={() => setModalOpen(true)}>Agregar un dia</button>

            {mensaje && <p className="mensaje">{mensaje}</p>}


            <table border="1" cellPadding={5}>
                <thead>
                    <tr>
                        <th>Día</th>
                        <th>Hora que inicia la clase</th>
                        <th>Hora que finaliza la clase</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>

                    {Distri.length > 0 ? (
                        Distri.map((dato) => (
                            <tr key={dato.id}>
                                <td>{dato.dia}</td>
                                <td>{dato.hora_ini}</td>
                                <td>{dato.hora_fin}</td>
                                <td>
                                    <button className="btn" onClick={() => handleClickAbrir(dato.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No hay datos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <h2 className="titulo">Registrar nuevo dia</h2>
                <form onSubmit={enviarFormulario} className="formulario">
                    <label>Día:</label>
                    <select onChange={(e) => setDia(e.target.value)} value={dia} required>
                        <option value="">-- Selecciona un día --</option>
                        <option value="Lunes">Lunes</option>
                        <option value="Martes">Martes</option>
                        <option value="Miércoles">Miércoles</option>
                        <option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option>
                    </select>

                    <label>Hora que inicia la clase:</label>
                    <input
                        type="time"
                        min="07:00"
                        max="22:00"
                        value={hora_ini}
                        onChange={handleHoraInicio}
                        required
                    />
                    <br />
                    <label>Hora que finaliza la clase:</label>
                    <input
                        type="time"
                        min="07:00"
                        max="22:00"
                        value={hora_fin}
                        onChange={handleHoraFin}
                        required
                    />
                    <button type="submit" className="btn-enviar">Enviar</button>
                </form>
            </Modal>

            <Modal open={modalOpen2} onClose={() => setModalOpen2(false)}>
                <h2 className="titulo">Eliminar dia</h2>
                <p>¿Estás seguro de que deseas eliminar este día?</p>
                <button type="submit" className="btn-enviar" onClick={handleClickDelete}>Eliminar</button>

            </Modal>
        </section>


    );
}