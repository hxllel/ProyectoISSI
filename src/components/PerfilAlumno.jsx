// src/components/PerfilAlumno.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPerfilAlumno, actualizarAlumno } from "../services/apiAlumno";

export function PerfilAlumno() {
  const { id } = useParams(); // "/alumno/:id/perfil"
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    ape_paterno: "",
    ape_materno: "",
    fecha_nacimiento: "",
    RFC: "",
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
    carrera: "",
    situacion: "",
    calificacion: ""
  });

  const [cargando, setCargando] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const p = await getPerfilAlumno(id);
        setForm({
          ...p,
          fecha_nacimiento: p.fecha_nacimiento
            ? p.fecha_nacimiento.substring(0, 10)
            : ""
        });
      } catch (e) {
        setErr(e.message);
      } finally {
        setCargando(false);
      }
    })();
  }, [id]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await actualizarAlumno(id, form);
      setMsg("Datos actualizados ✅");
    } catch (e) {
      setErr(e.message);
    }
  };

  if (cargando) return <p>Cargando perfil...</p>;
  if (err) return <p style={{ color: "crimson" }}>Error: {err}</p>;

  return (
    <div style={{ maxWidth: 800, margin: "24px auto", padding: 16 }}>
      <h2>Mi Perfil — Alumno {id}</h2>

      {msg && (
        <div style={{ background: "#e8ffe8", padding: 8, margin: "12px 0" }}>
          {msg}
        </div>
      )}
      {err && (
        <div style={{ background: "#ffe8e8", padding: 8, margin: "12px 0" }}>
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="perfil-form">
        <div className="grid-2">
          <label>
            Nombre
            <input name="nombre" value={form.nombre} onChange={onChange} required />
          </label>
          <label>
            Apellido paterno
            <input name="ape_paterno" value={form.ape_paterno} onChange={onChange} required />
          </label>
          <label>
            Apellido materno
            <input name="ape_materno" value={form.ape_materno} onChange={onChange} required />
          </label>
          <label>
            Fecha nacimiento
            <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={onChange} required />
          </label>
          <label>
            RFC
            <input name="RFC" value={form.RFC} onChange={onChange} />
          </label>
          <label>
            Tipo de sangre
            <input name="tipo_sangre" value={form.tipo_sangre} onChange={onChange} />
          </label>
          <label>
            CURP
            <input name="CURP" value={form.CURP} onChange={onChange} required />
          </label>
          <label>
            Nacionalidad
            <input name="nacionalidad" value={form.nacionalidad} onChange={onChange} required />
          </label>
          <label>
            Calle
            <input name="calle" value={form.calle} onChange={onChange} required />
          </label>
          <label>
            Teléfono
            <input name="telefono" value={form.telefono} onChange={onChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={onChange} required />
          </label>
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit">Guardar cambios</button>
          <Link to={`/alumno/${id}`} style={{ marginLeft: 12 }}>
            Volver
          </Link>
        </div>
      </form>

      <style>{`
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .grid-2 label {
          display: flex;
          flex-direction: column;
          font-size: 14px;
          gap: 6px;
        }
        input {
          padding: 6px 8px;
        }
      `}</style>
    </div>
  );
}
