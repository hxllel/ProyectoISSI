import React, { useEffect, useState } from "react";
import "./RegistrarCursos.css";

const BASE_URL = import.meta?.env?.VITE_API_URL || "http://localhost:4000";

/**
 * Este componente:
 * - LEE catálogos (Profesores y UAs) desde tu backend (MySQL) para poblar selects.
 * - ENVÍA (POST) el curso nuevo a tu backend para guardarlo en MySQL.
 * - Usa credentials:"include" para sesiones/cookies.
 */
function RegistrarCursos() {
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [saving, setSaving] = useState(false);
  const [profesores, setProfesores] = useState([]);
  const [uas, setUas] = useState([]);

  const [form, setForm] = useState({
    id_profesor: "",
    id_UA: "",
    carrera: "",
    semestre: "",
    grupo: "",
    turno: "",
    horario: "",
    cupo: 35,
    clave_grupo: ""
  });

  const semestres = ["1","2","3","4","5","6","7","8"];
  const grupos = ["1IM1","2IM2","3IM3","4IM4","5IM5","6IM6","7IM7","8IM8"];
  const turnos = ["Matutino","Vespertino"];

  // Helpers para tolerar diferentes formas de respuesta del backend
  const mapProfesores = (payload) => payload?.profesores ?? payload?.data ?? (Array.isArray(payload) ? payload : []);
  const mapUAs        = (payload) => payload?.ua         ?? payload?.UAs ?? payload?.data ?? (Array.isArray(payload) ? payload : []);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // Carga catálogos desde la BD vía backend
        const [pRes, uRes] = await Promise.all([
          fetch(`${BASE_URL}/ObtenerProfesores`, { credentials: "include" }),
          fetch(`${BASE_URL}/ObtenerUA`,         { credentials: "include" }),
        ]);

        const [pJson, uJson] = await Promise.all([pRes.json(), uRes.json()]);
        if (!alive) return;

        setProfesores(mapProfesores(pJson));
        setUas(mapUAs(uJson));
      } catch (e) {
        setStatus({ type: "error", msg: "No se pudieron cargar catálogos desde la base de datos." });
      }
    })();

    return () => { alive = false; };
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    // Validación mínima
    if (!form.id_profesor || !form.id_UA || !form.turno || !form.clave_grupo) {
      setStatus({ type: "error", msg: "Completa profesor, U.A., turno y clave de grupo." });
      return;
    }

    try {
      setSaving(true);

      // Guarda en la BD vía backend
      const res = await fetch(`${BASE_URL}/RegistrarCurso`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error al registrar curso.");

      setStatus({ type: "ok", msg: "Curso registrado correctamente en la base de datos." });
      setForm({
        id_profesor: "",
        id_UA: "",
        carrera: "",
        semestre: "",
        grupo: "",
        turno: "",
        horario: "",
        cupo: 35,
        clave_grupo: ""
      });
    } catch (e) {
      setStatus({ type: "error", msg: e.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rc-wrap">
      <header className="rc-header">
        <div>
          <h1>Registrar Curso</h1>
          <p className="rc-sub">Asigna docente, U.A. y parámetros (datos desde BD)</p>
        </div>
        <img className="rc-logo" src="/escom-logo.png" alt="ESCOM" />
      </header>

      <form className="rc-card" onSubmit={handleSubmit} noValidate>
        {/* Banner opcional con tips */}
        <div className="rc-banner">
          Verifica profesor, U.A. y turno antes de guardar. Campos obligatorios marcados con *.
        </div>

        <div className="rc-grid">
          <div className="rc-field">
            <label>Profesor *</label>
            <select name="id_profesor" value={form.id_profesor} onChange={handleChange}>
              <option value="">Selecciona…</option>
              {profesores.map((p) => (
                <option key={p.id || p.id_profesor} value={p.id || p.id_profesor}>
                  {p.nombre ? `${p.nombre} ${p.apellidos ?? ""}` : (p.profesor || "Profesor")}
                </option>
              ))}
            </select>
            <span className="rc-help">Catálogo cargado desde BD</span>
          </div>

          <div className="rc-field">
            <label>Unidad de Aprendizaje *</label>
            <select name="id_UA" value={form.id_UA} onChange={handleChange}>
              <option value="">Selecciona…</option>
              {uas.map((u) => (
                <option key={u.id || u.id_UA} value={u.id || u.id_UA}>
                  {u.nombre || u.UA || u.clave}
                </option>
              ))}
            </select>
            <span className="rc-help">Catálogo cargado desde BD</span>
          </div>

          <div className="rc-field">
            <label>Turno *</label>
            <select name="turno" value={form.turno} onChange={handleChange}>
              <option value="">Selecciona…</option>
              {turnos.map((t)=> <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="rc-field">
            <label>Clave grupo *</label>
            <input name="clave_grupo" value={form.clave_grupo} onChange={handleChange} placeholder="Ej. 5IM5-A"/>
          </div>

          <div className="rc-field">
            <label>Carrera</label>
            <input name="carrera" value={form.carrera} onChange={handleChange} placeholder="IAI / ISC / LCD"/>
          </div>

          <div className="rc-field">
            <label>Semestre</label>
            <select name="semestre" value={form.semestre} onChange={handleChange}>
              <option value="">—</option>
              {semestres.map((s)=> <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="rc-field">
            <label>Grupo</label>
            <select name="grupo" value={form.grupo} onChange={handleChange}>
              <option value="">—</option>
              {grupos.map((g)=> <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="rc-field">
            <label>Horario</label>
            <input name="horario" value={form.horario} onChange={handleChange} placeholder="L-M-X 07:00-09:00"/>
            <div className="rc-pill">Ejemplo: L-M-X 07:00–09:00</div>
          </div>

          <div className="rc-field">
            <label>Cupo</label>
            <input type="number" name="cupo" min="1" max="90" value={form.cupo} onChange={handleChange}/>
          </div>
        </div>

        <div className="rc-actions">
          <button className="rc-btn primary" disabled={saving}>
            {saving ? "Guardando…" : "Guardar"}
          </button>
          <button
            type="button"
            className="rc-btn ghost"
            onClick={() => setForm({
              id_profesor:"", id_UA:"", carrera:"", semestre:"", grupo:"",
              turno:"", horario:"", cupo:35, clave_grupo:""
            })}
          >
            Limpiar
          </button>
        </div>

        {status.msg && (
          <div className={`rc-alert ${status.type === "ok" ? "ok" : "error"}`}>
            {status.msg}
          </div>
        )}
      </form>
    </div>
  );
}

export default RegistrarCursos;
export { RegistrarCursos };   // Para que funcione: import { RegistrarCursos } from "...";
