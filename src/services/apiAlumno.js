// src/services/apiAlumno.js

// Llamada GET: obtener los datos personales del alumno
export async function getPerfilAlumno(id) {
  const res = await fetch(`/Alumno/Perfil/${id}`, { credentials: "include" });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Error al obtener perfil");
  return data.data;
}

// Llamada PUT: actualizar datos personales
export async function actualizarAlumno(id, payload) {
  const res = await fetch(`/Alumno/Actualizar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Error al actualizar");
  return data.data; // devuelve el registro actualizado
}
