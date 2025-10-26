const express = require('express');
const bd = require('../../model/modelo');
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
const { raw } = require('mysql2');

// ⬇️ helper externo (lo tenías al final; lo dejamos aquí igual podría ir al final)
function seTraslapan(d1, d2) {
  // Solo comparar si es el mismo día
  if (d1.dia !== d2.dia) return false;

  const ini1 = parseInt(d1.hora_ini.replace(":", ""));
  const fin1 = parseInt(d1.hora_fin.replace(":", ""));
  const ini2 = parseInt(d2.hora_ini.replace(":", ""));
  const fin2 = parseInt(d2.hora_fin.replace(":", ""));

  // Se traslapan si uno empieza antes de que el otro termine y termina después de que el otro empieza
  return ini1 < fin2 && ini2 < fin1;
}

module.exports = (passport) => {
  const router = express.Router();

  // =========================
  // NUEVAS RUTAS (PERFIL)
  // =========================

  // Devuelve datos personales del alumno por id
  router.get("/Alumno/Perfil/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const alumno = await bd.DatosPersonales.findOne({
        where: { id },
        attributes: [
          "id", "nombre", "ape_paterno", "ape_materno",
          "fecha_nacimiento", "RFC", "tipo_sangre", "CURP",
          "nacionalidad", "calle", "num_exterior", "num_interior",
          "codigo_postal", "colonia", "delegacion", "ciudad",
          "telefono", "email", "grado", "carrera", "situacion", "calificacion"
        ]
      });

      if (!alumno) {
        return res.status(404).json({ success: false, message: "Alumno no encontrado" });
      }

      return res.json({ success: true, data: alumno });
    } catch (err) {
      console.error("Error GET /Alumno/Perfil:", err);
      return res.status(500).json({ success: false, message: "Error del servidor" });
    }
  });

  // ACTUALIZAR DATOS — Actualiza únicamente los campos permitidos (lista blanca)
  router.put("/Alumno/Actualizar/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Lista blanca según tu BD (tabla datos_personales del bd.sql)
      const allowed = [
        "nombre", "ape_paterno", "ape_materno",
        "fecha_nacimiento", "RFC", "tipo_sangre", "CURP",
        "nacionalidad", "calle", "num_exterior", "num_interior",
        "codigo_postal", "colonia", "delegacion", "ciudad",
        "telefono", "email", "grado", "carrera", "situacion", "calificacion"
      ];

      const payload = {};
      for (const k of allowed) {
        if (k in req.body) payload[k] = req.body[k];
      }

      if (Object.keys(payload).length === 0) {
        return res.status(400).json({ success: false, message: "No hay campos válidos para actualizar" });
      }

      const [updated] = await bd.DatosPersonales.update(payload, { where: { id } });

      if (updated === 0) {
        return res.status(404).json({ success: false, message: "Alumno no encontrado o sin cambios" });
      }

      // Devolver el registro actualizado (opcional, útil para refrescar el front)
      const alumno = await bd.DatosPersonales.findOne({
        where: { id },
        attributes: [
          "id", "nombre", "ape_paterno", "ape_materno",
          "fecha_nacimiento", "RFC", "tipo_sangre", "CURP",
          "nacionalidad", "calle", "num_exterior", "num_interior",
          "codigo_postal", "colonia", "delegacion", "ciudad",
          "telefono", "email", "grado", "carrera", "situacion", "calificacion"
        ]
      });

      return res.json({
        success: true,
        message: "Datos personales actualizados correctamente",
        data: alumno
      });
    } catch (err) {
      console.error("Error PUT /Alumno/Actualizar:", err);
      return res.status(500).json({ success: false, message: "Error del servidor" });
    }
  });

  // =========================
  // RUTAS QUE YA TENÍAS
  // =========================

  router.get("/Grupos/:id", async (req, res) => {
    const us = req.user.id;
    const { id } = req.params;

    const cre = await bd.Estudiante.findOne({
      where: { id_usuario: us }
    });

    if (!req.session.tempGrupos) {
      req.session.tempGrupos = [];
      req.session.creditos = parseInt(cre.creditos_disponibles, 10);
    }

    try {
      const carr = await bd.DatosPersonales.findOne({
        where: { id: id },
      });

      // Obtener los grupos con includes
      const grupos = await bd.Grupo.findAll({
        attributes: ["id", "nombre", "turno", "cupo"],
        include: [
          {
            model: bd.Unidad_Aprendizaje,
            attributes: ["nombre", "credito", "semestre", "carrera"],
            where: { carrera: carr.carrera },
          },
          {
            model: bd.DatosPersonales,
            attributes: ["nombre", "ape_paterno", "ape_materno"],
          },
        ],
        raw: true,
        nest: true,
      });

      return res.json({ grupos, creditos: req.session.creditos });
    } catch (error) {
      console.error("Error al obtener los grupos:", error);
      res.status(500).json({ error: "Error interno" });
    }
  });

  router.get("/ObtenerDist/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const Distri = await bd.Distribucion.findAll({
        where: { id_grupo: id },
        attributes: ['dia', 'hora_ini', 'hora_fin']
      });
      return res.json({ Distri });
    } catch (error) {
      console.error("Error al obtener la distribucion de horas:", error);
      res.status(500).json({ error: "Error interno" });
    }
  });

  router.post("/Agregar/:id", async (req, res) => {
    const { id } = req.params;
    const us = req.user.id;
    console.log(us);

    const cre = await bd.Estudiante.findOne({
      where: { id_usuario: us }
    });

    const cuesta = await bd.Grupo.findOne({
      where: { id: id },
      include: [{
        model: bd.Unidad_Aprendizaje,
        attributes: ["credito"]
      }],
      raw: true,
      nest: true
    });

    if (!req.session.tempGrupos) {
      req.session.tempGrupos = [];
      req.session.creditos = parseInt(cre.creditos_disponibles, 10);
    }

    if (!req.session.tempGrupos.includes(id)) {

      const gruposActuales = req.session.tempGrupos || [];

      const distribuciones = await bd.Distribucion.findAll({
        attributes: ["dia", "hora_ini", "hora_fin", "id_grupo"],
        where: {
          id_grupo: [...gruposActuales, id]
        }
      });

      // Distribución del nuevo grupo
      const distriNuevo = distribuciones.filter(d => d.id_grupo === id);

      // Comparar contra cada grupo actual
      for (const g of gruposActuales) {
        const distriExistente = distribuciones.filter(d => d.id_grupo === g);

        for (const dis of distriExistente) {
          for (const disNuevo of distriNuevo) {
            if (seTraslapan(dis, disNuevo)) {
              return res.json({
                success: false,
                err: `El grupo ${id} se traslapa con el grupo ${g}`,
                tempGrupo: req.session.tempGrupos,
                creditos: req.session.creditos
              });
            }
          }
        }
      }

      if (parseInt(req.session.creditos, 10) < parseInt(cuesta.Unidad_Aprendizaje.credito, 10)) {
        return res.json({ success: false, tempGrupo: req.session.tempGrupos, creditos: req.session.creditos, err: "No tienes creditos suficientes" });
      } else {
        req.session.creditos = parseInt(req.session.creditos, 10) - parseInt(cuesta.Unidad_Aprendizaje.credito, 10)
        req.session.tempGrupos.push(id);
        console.log("Grupo guardado: ", req.session.tempGrupos);
        console.log("Creditos:", req.session.creditos)
        return res.json({ success: true, tempGrupo: req.session.tempGrupos, creditos: req.session.creditos });
      }
    }
  });

  router.post("/Inscribirse", async (req, res) => {

    if (req.session.tempGrupos == []) {
      return res.json({ success: false });
    } else {
      try {
        const ids = req.session.tempGrupos;
        const creditos_restantes = req.session.creditos;
        const id = req.user.id;

        console.log("IDS", ids);
        console.log("creditos restantes", creditos_restantes);
        console.log("ID US", id);

        const idh = await bd.Horario.findOne({
          where: { id_alumno: id }
        });

        await bd.Estudiante.update({
          creditos_disponibles: creditos_restantes
        }, { where: { id_usuario: id } });

        for (const g of ids) {
          const id2 = uuidv4().replace(/-/g, "").substring(0, 15);
          await bd.Mat_Inscritos.create({
            id: id2,
            id_horario: idh.id,
            id_grupo: g,
            calificacion: 0
          });
          const cup_act = await bd.Grupo.findOne({
            where: { id: g }
          });

          await bd.Grupo.update({
            cupo: parseInt(cup_act.cupo, 10) - 1
          }, { where: { id: g } });
        }

        return res.json({ success: true });

      } catch (err) {
        console.log(err);
        return res.json({ success: false });
      }
    }
  });

  router.post("/Del/:id", async (req, res) => {
    const { id } = req.params
    const us = req.user.id;

    const cre = await bd.Estudiante.findOne({
      where: { id_usuario: us }
    });

    const cuesta = await bd.Grupo.findOne({
      where: { id: id },
      include: [{
        model: bd.Unidad_Aprendizaje,
        attributes: ["credito"]
      }],
      raw: true,
      nest: true
    });

    req.session.tempGrupos = req.session.tempGrupos.filter(g => g != id);
    req.session.creditos = parseInt(req.session.creditos, 10) + parseInt(cuesta.Unidad_Aprendizaje.credito, 10)

    console.log("Grupo sin el elemento ", req.session.tempGrupos);
    console.log("Creditos:", req.session.creditos)
    res.json({ success: true, tempGrupo: req.session.tempGrupos, creditos: req.session.creditos });
  });

  return router;
};


