import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditarGrupo.css";

const BASE_URL = import.meta?.env?.VITE_API_URL || "http://localhost:4000";

function EditarGrupo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profesores, setProfesores] = useState([]);
  const [uas, setUas] = useState([]);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [grupo, setGrupo] = useState({
    id_profesor: "", id_UA: "", turno: "",
    carrera: "", semestre: "", clave_grupo: "", cupo: 35,
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [p,u,g] = await Promise.all([
          fetch(`${BASE_URL}/ObtenerProfesores`, { credentials: "include" }),
          fetch(`${BASE_URL}/ObtenerUA`, { credentials: "include" }),
          fetch(`${BASE_URL}/ObtenerGrupo/${id}`, { credentials: "include" })
        ]);
        const pj = await p.json(); const uj = await u.json(); const gj = await g.json();
        if (!alive) return;
        setProfesores(pj?.profesores ?? []);
        setUas(uj?.ua ?? uj?.UAs ?? []);
        setGrupo({
          id_profesor: gj?.grupo?.id_profesor ?? "",
          id_UA: gj?.grupo?.id_UA ?? "",
          turno: gj?.grupo?.turno ?? "",
          carrera: gj?.grupo?.carrera ?? "",
          semestre: gj?.grupo?.semestre?.toString?.() ?? "",
          clave_grupo: gj?.grupo?.clave_grupo ?? "",
          cupo: gj?.grupo?.cupo ?? 35,
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
    setGrupo((g) => ({ ...g, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    if (!grupo.id_profesor || !grupo.id_UA || !grupo.turno || !grupo.clave_grupo) {
      setStatus({ type: "error", msg: "Completa profesor, U.A., turno y clave." });
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(`${BASE_URL}/ActualizarGrupo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(grupo),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error al actualizar el grupo.");
      setStatus({ type: "ok", msg: "Grupo actualizado correctamente." });
      setTimeout(() => navigate(-1), 900);
    } catch (e) {
      setStatus({ type: "error", msg: e.message });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="eg-wrap">
        <div className="eg-card"><p className="eg-loading">Cargando…</p></div>
      </div>
    );
  }

  return (
    <div className="eg-wrap">
      <header className="eg-header">
        <div>
          <h1>Editar Grupo</h1>
          <p className="eg-sub">Docente, U.A. y parámetros</p>
        </div>
        <img className="eg-logo" src="/escom-logo.png" alt="ESCOM" />
      </header>

      <form className="eg-card" onSubmit={handleSubmit} noValidate>
        <div className="eg-grid">
          <div className="eg-field">
            <label>Profesor *</label>
            <select name="id_profesor" value={grupo.id_profesor} onChange={handleChange}>
              <option value="">Selecciona…</option>
              {profesores.map((p) => (
                <option key={p.id || p.id_profesor} value={p.id || p.id_profesor}>
                  {p.nombre ? `${p.nombre} ${p.apellidos ?? ""}` : (p.profesor || "Profesor")}
                </option>
              ))}
            </select>
          </div>

          <div className="eg-field">
            <label>Unidad de Aprendizaje *</label>
            <select name="id_UA" value={grupo.id_UA} onChange={handleChange}>
              <option value="">Selecciona…</option>
              {uas.map((u) => (
                <option key={u.id || u.id_UA} value={u.id || u.id_UA}>
                  {u.nombre || u.UA || u.clave}
                </option>
              ))}
            </select>
          </div>

          <div className="eg-field">
            <label>Turno *</label>
            <select name="turno" value={grupo.turno} onChange={handleChange}>
              <option value="">Selecciona…</option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
            </select>
          </div>

          <div className="eg-field">
            <label>Clave grupo *</label>
            <input name="clave_grupo" value={grupo.clave_grupo} onChange={handleChange} placeholder="Ej. 5IM5-A" />
          </div>

          <div className="eg-field">
            <label>Carrera</label>
            <input name="carrera" value={grupo.carrera} onChange={handleChange} placeholder="IAI / ISC / LCD" />
          </div>

          <div className="eg-field">
            <label>Semestre</label>
            <select name="semestre" value={grupo.semestre} onChange={handleChange}>
              <option value="">—</option>
              {["1","2","3","4","5","6","7","8"].map((s)=> <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="eg-field">
            <label>Cupo</label>
            <input type="number" name="cupo" min="1" max="90" value={grupo.cupo} onChange={handleChange}/>
          </div>
        </div>

        <div className="eg-actions">
          <button className="eg-btn primary" disabled={saving}>
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
          <button type="button" className="eg-btn ghost" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>

        {status.msg && (
          <div className={`eg-alert ${status.type === "ok" ? "ok" : "error"}`}>
            {status.msg}
          </div>
        )}
      </form>
    </div>
  );
}

export default EditarGrupo;   
export { EditarGrupo };       
