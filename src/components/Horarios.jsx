import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "./Modal";


export default function Horarios({ alumnoId: propAlumnoId, onClose }) {
  const params = useParams();
  const [datos, setDatos] = useState([]);
  const [borr, setBorr] = useState([]);

  const alumnoId = propAlumnoId || params.id;

  const [add, setAdd] = useState(null);
  const [idgru, setIdgru] = useState("");
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    fetch("http://localhost:4000/ObtenerGrupo", { credentials: "include", })
      .then((res) => res.json())
      .then((data) => {
        const cursos = Array.isArray(data && data.cursos) ? data.cursos : [];
        setDatos(cursos);
        console.log('ObtenerGrupo response count =', cursos.length);
      })
      .catch((err) => {
        console.error("Error al obtener los cursos:", err);
        setDatos([]);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/ConsultarBorrador", { credentials: "include", })
      .then((res) => res.json())
      .then((data) => {
        const borr = Array.isArray(data && data.horario) ? data.horario : [];
        setBorr(borr);
        console.log('ObtenerGrupo response count =', borr.length);
      })
      .catch((err) => {
        console.error("Error al obtener el horario:", err);
        setBorr([]);
      });
  }, []);


  const handleClickAdd = (id) => {
    setAdd(true);
    setIdgru(id);
  }


  useEffect(() => {
    if (add) {
      fetch(`http://localhost:4000/AgregarBorrador/${idgru}`, { method: "POST", credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("Se ha agregado exitosamente a tu borrador de horario la materia");
          } else {
            alert("No se ha podido agregar la materia al borrador de horario");
          }
        })
        .catch((err) => console.error("Error al agregar borrador:", err))
        .finally(() => setAdd(false));
    }
  }, [add, idgru]);



  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Horarios de Clase</h2>


        {onClose ? <button onClick={onClose}>Cerrar</button> : null}
      </div>

      <button onClick={() => setModalOpen(true)}>Ver borrador de horario</button>


      <table border="1" cellPadding={5}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Profesor</th>
            <th>Unidad de Aprendizaje</th>
            <th>Turno</th>
            <th>Carrera</th>
            <th>Cupo</th>
            <th>Lunes</th>
            <th>Martes</th>
            <th>Miércoles</th>
            <th>Jueves</th>
            <th>Viernes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(datos) ? datos : []).map((dato) => {
            // Distribuciones pueden venir como array o como objeto único
            const distribsRaw = dato.Distribucion || [];
            const distribs = Array.isArray(distribsRaw) ? distribsRaw : [distribsRaw];

            const horasPorDia = (dia) => {
              // Normalizar día Miércoles
              if (dia === 'Miercoles') {
                const vals = distribs
                  .filter(d => d && (d.dia === 'Miércoles' || d.dia === 'Miercoles'))
                  .map(d => `${d.hora_ini} - ${d.hora_fin}`);
                return vals.join(', ');
              }
              const vals = distribs
                .filter(d => d && d.dia === dia)
                .map(d => `${d.hora_ini} - ${d.hora_fin}`);
              return vals.join(', ');
            };

            return (
              <tr key={dato.id}>
                <td>{dato.nombre}</td>
                <td>{dato.DatosPersonale && `${dato.DatosPersonale.nombre || ''} ${dato.DatosPersonale.ape_paterno || ''} ${dato.DatosPersonale.ape_materno || ''}`}</td>
                <td>{dato.Unidad_Aprendizaje && dato.Unidad_Aprendizaje.nombre}</td>
                <td>{dato.turno}</td>
                <td>{dato.Unidad_Aprendizaje && dato.Unidad_Aprendizaje.carrera}</td>
                <td>{dato.cupo}</td>
                <td>{horasPorDia('Lunes') || ' '}</td>
                <td>{horasPorDia('Martes') || ' '}</td>
                <td>{horasPorDia('Miercoles') || ' '}</td>
                <td>{horasPorDia('Jueves') || ' '}</td>
                <td>{horasPorDia('Viernes') || ' '}</td>
                <td><button onClick={() => handleClickAdd(dato.id)} disabled={borr.some(b => b.id_grupo === dato.id)}>Agregar al borrador de horario</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h1>Borrador de horario</h1>
        <table border="1" cellPadding={5}>
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Profesor</th>
              <th>Calificacion del profesor</th>
              <th>Materia</th>
              <th>Cupo</th>
              <th>Lunes</th>
              <th>Martes</th>
              <th>Miercoles</th>
              <th>Jueves</th>
              <th>Viernes</th>
              <th>Es valido</th>
              <th>Acciones</th>

            </tr>
          </thead>
          <tbody>
            {borr.length > 0 ? (
              borr.map((dato) => (
                <tr key={dato.id}>
                  <td>{dato.Grupo.nombre}</td>
                  <td>{dato.profesor.nombre} {dato.profesor.ape_paterno} {dato.profesor.ape_materno} </td>
                  <td>{dato.calificacion}</td>
                  <td>{dato.materia}</td>
                  <td>{dato.Grupo.cupo}</td>
                  <td>{dato.horas_lun || " "}</td>
                  <td>{dato.horas_mar || " "}</td>
                  <td>{dato.horas_mie || " "}</td>
                  <td>{dato.horas_jue || " "}</td>
                  <td>{dato.horas_vie || " "}</td>
                  <td>{dato.valido === 1 ? "Es valido" : " No es valido"}</td>
                  <td><button>Retirar del borrador</button></td>
                </tr>
              ))
            ) : (
              <tr colSpan="12"><td>No hay datos disponibles</td></tr>
            )}
          </tbody>

        </table>

      </Modal>
    </section>


  );
}
