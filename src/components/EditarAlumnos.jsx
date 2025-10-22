import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditarAlumnos.css";

const BASE_URL = import.meta?.env?.VITE_API_URL || "http://localhost:4000";

function EditarAlumnos() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const carreras = [
    "Ing. en Inteligencia Artificial",
    "Ing. en Sistemas Computacionales",
    "Licenciatura en Ciencias de Datos",
  ];
  const semestres = ["1","2","3","4","5","6","7","8"];
  const grupos = ["1IM1","2IM2","3IM3","4IM4","5IM5","6IM6","7IM7","8IM8"];

  const [form, setForm] = useState({
    boleta: "", nombre: "", apellidos: "", correo: "",
    carrera: "", semestre: "", grupo: ""
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/ObtenerAlumno/${id}`, { credentials: "include" });
        if (!res.ok) throw new Error("No se pudo obtener el alumno.");
        const { alumno } = await res.json();
        if (!alive) return;
        setForm({
          boleta: alumno?.boleta ?? "",
          nombre: alumno?.nombre ?? "",
          apellidos: alumno?.apellidos ?? "",
          correo: alumno?.correo ?? "",
          carrera: alumno?.carrera ?? "",
          semestre: alumno?.semestre?.toString?.() ?? "",
          grupo: alumno?.grupo ?? "",
        });
      } catch (e) {
        setStatus({ type: "error", msg: e.message });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    if (!form.boleta || !form.nombre || !form.apellidos || !form.correo) {
      setStatus({ type: "error", msg: "Completa los campos obligatorios." });
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(`${BASE_URL}/ActualizarAlumno/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error al actualizar.");
      setStatus({ type: "ok", msg: "Alumno actualizado correctamente." });
      setTimeout(() => navigate(-1), 900);
    } catch (e) {
      setStatus({ type: "error", msg: e.message });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="ea-wrap">
        <div className="ea-card"><p className="ea-loading">Cargando…</p></div>
      </div>
    );
  }

  return (
    <div className="ea-wrap">
      <header className="ea-header">
        <div>
          <h1>Editar Alumno</h1>
          <p className="ea-sub">Actualiza los datos del estudiante</p>
        </div>
        <img className="ea-logo" src="/escom-logo.png" alt="ESCOM" />
      </header>

      <form className="ea-card" onSubmit={handleSubmit} noValidate>
        <div className="ea-grid">
          <div className="ea-field">
            <label>Boleta *</label>
            <input name="boleta" value={form.boleta} onChange={handleChange} />
          </div>
          <div className="ea-field">
            <label>Nombre *</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} />
          </div>
          <div className="ea-field">
            <label>Apellidos *</label>
            <input name="apellidos" value={form.apellidos} onChange={handleChange} />
          </div>
          <div className="ea-field">
            <label>Correo institucional *</label>
            <input type="email" name="correo" value={form.correo} onChange={handleChange} />
          </div>

          <div className="ea-field">
            <label>Carrera</label>
            <select name="carrera" value={form.carrera} onChange={handleChange}>
              <option value="">Selecciona…</option>
              {carreras.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="ea-field">
            <label>Semestre</label>
            <select name="semestre" value={form.semestre} onChange={handleChange}>
              <option value="">Selecciona…</option>
              {semestres.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="ea-field">
            <label>Grupo</label>
            <select name="grupo" value={form.grupo} onChange={handleChange}>
              <option value="">Selecciona…</option>
              {grupos.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="ea-actions">
          <button className="ea-btn primary" disabled={saving}>
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
          <button type="button" className="ea-btn ghost" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>

        {status.msg && (
          <div className={`ea-alert ${status.type === "ok" ? "ok" : "error"}`}>
            {status.msg}
          </div>
        )}
      </form>
    </div>
  );
}

export default EditarAlumnos;   
export { EditarAlumnos };       
