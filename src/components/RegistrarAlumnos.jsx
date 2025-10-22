import React, { useState } from "react";
import "./RegistrarAlumnos.css";

const BASE_URL = import.meta?.env?.VITE_API_URL || "http://localhost:4000";

function RegistrarAlumnos() {  
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const carreras = [
    "Ing. en Inteligencia Artificial",
    "Ing. en Sistemas Computacionales",
    "Licenciatura en Ciencias de Datos",
  ];
  const semestres = ["1","2","3","4","5","6","7","8"];
  const grupos = ["1IM1","2IM2","3IM3","4IM4","5IM5","6IM6","7IM7","8IM8"];

  const [form, setForm] = useState({
    boleta: "", nombre: "", apellidos: "", correo: "",
    carrera: "", semestre: "", grupo: "", contrasena: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    if (!form.boleta || !form.nombre || !form.apellidos || !form.correo || !form.contrasena) {
      setStatus({ type: "error", msg: "Completa los campos obligatorios." });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/registrarAlumno`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error al registrar.");
      setStatus({ type: "ok", msg: "Alumno registrado correctamente." });
      setForm({ boleta:"", nombre:"", apellidos:"", correo:"", carrera:"", semestre:"", grupo:"", contrasena:"" });
    } catch (e) {
      setStatus({ type: "error", msg: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ra-wrap">
      <header className="ra-header">
        <div>
          <h1>Registrar Alumno</h1>
          <p className="ra-sub">Ingresa los datos del estudiante</p>
        </div>
        <img className="ra-logo" src="/escom-logo.png" alt="ESCOM" />
      </header>

      <form className="ra-card" onSubmit={handleSubmit} noValidate>
        <div className="ra-grid">
          <div className="ra-field">
            <label>Boleta *</label>
            <input name="boleta" value={form.boleta} onChange={handleChange} placeholder="Ej. 2025123456"/>
          </div>
          <div className="ra-field">
            <label>Nombre *</label>
            <input name="nombre" value={form.nombre} onChange={handleChange}/>
          </div>
          <div className="ra-field">
            <label>Apellidos *</label>
            <input name="apellidos" value={form.apellidos} onChange={handleChange}/>
          </div>
          <div className="ra-field">
            <label>Correo institucional *</label>
            <input type="email" name="correo" value={form.correo} onChange={handleChange}/>
          </div>
          <div className="ra-field">
            <label>Carrera</label>
            <select name="carrera" value={form.carrera} onChange={handleChange}>
              <option value="">Selecciona…</option>
              {carreras.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="ra-field">
            <label>Semestre</label>
            <select name="semestre" value={form.semestre} onChange={handleChange}>
              <option value="">Selecciona…</option>
              {semestres.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="ra-field">
            <label>Grupo</label>
            <select name="grupo" value={form.grupo} onChange={handleChange}>
              <option value="">Selecciona…</option>
              {grupos.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="ra-field">
            <label>Contraseña inicial *</label>
            <input type="password" name="contrasena" value={form.contrasena} onChange={handleChange} placeholder="Mínimo 8 caracteres"/>
          </div>
        </div>

        <div className="ra-actions">
          <button className="ra-btn primary" disabled={loading}>{loading ? "Guardando…" : "Guardar"}</button>
          <button type="button" className="ra-btn ghost" onClick={() => setForm({ boleta:"", nombre:"", apellidos:"", correo:"", carrera:"", semestre:"", grupo:"", contrasena:"" })}>Limpiar</button>
        </div>

        {status.msg && <div className={`ra-alert ${status.type === "ok" ? "ok" : "error"}`}>{status.msg}</div>}
      </form>
    </div>
  );
}

export default RegistrarAlumnos;  
export { RegistrarAlumnos };    
