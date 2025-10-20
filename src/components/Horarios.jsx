import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Horarios({ alumnoId: propAlumnoId, onClose }) {
  const params = useParams();
  const [datos, setDatos] = useState([]);

  const alumnoId = propAlumnoId || params.id;
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

 

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Horarios de Clase</h2>
        {onClose ? <button onClick={onClose}>Cerrar</button> : null}
      </div>

           
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
              <td>{/* Acciones si se requieren */}</td>
            </tr>
            )
          })}
                </tbody>
            </table>
          {filas.length > 0 ? (
            filas.map((f) => (
              <tr key={f.id_grupo || f.id_ua}>
                <td>{f.id_ua}</td>
                <td>{f.nombre_ua}</td>
                <td>{f.profesor}</td>
                <td>{f.calificacion_profesor}</td>
                <td>{f.cupo}</td>
                <td>{(f.dias && f.dias.Lunes) ? f.dias.Lunes.join(", ") : ""}</td>
                <td>{(f.dias && f.dias.Martes) ? f.dias.Martes.join(", ") : ""}</td>
                <td>{(f.dias && f.dias.Miercoles) ? f.dias.Miercoles.join(", ") : ""}</td>
                <td>{(f.dias && f.dias.Jueves) ? f.dias.Jueves.join(", ") : ""}</td>
                <td>{(f.dias && f.dias.Viernes) ? f.dias.Viernes.join(", ") : ""}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No hay horarios para mostrar</td>
            </tr>
          )}
    </section>
  );
}
