const express = require('express');
const bd = require('../../model/modelo');
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
const { raw } = require('mysql2');


module.exports = (passport) =>{
    const router = express.Router();


    router.get("/Grupos/:id", async (req, res) => {
    const us = req.user.id;

    const { id } = req.params;

    const cre = await bd.Estudiante.findOne({
          where: {id_usuario : us}
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

    return res.json({ grupos, creditos : req.session.creditos });
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
router.get("/ObtenerGrupo", async(req,res)=>{

    try{
      // Traer los grupos con datos personales y unidad de aprendizaje
      const cursos = await bd.Grupo.findAll({
        include: [
          {
            model: bd.DatosPersonales,
            attributes :["nombre", "ape_paterno", "ape_materno"],
          },
          {
            model: bd.Unidad_Aprendizaje,
            attributes: ["nombre", "carrera"],
          }
        ],
        raw: true,
        nest: true
      }); 

      console.log('ObtenerGrupo: cursos obtenidos =', cursos.length);

      // Si no hay cursos, devolver array vacío
      if (!Array.isArray(cursos) || cursos.length === 0) {
        return res.json({ cursos: [] });
      }

      // Obtener todas las distribuciones para los grupos obtenidos en una sola consulta
      const groupIds = cursos.map(c => c.id);
      const distribuciones = await bd.Distribucion.findAll({
        where: { id_grupo: groupIds },
        attributes: ["id", "id_grupo", "dia", "hora_ini", "hora_fin"],
        raw: true,
      });

      // Adjuntar distribuciones a cada curso
      const cursosConDistrib = cursos.map(c => {
        const d = distribuciones.filter(x => x.id_grupo === c.id);
        return { ...c, Distribucion: d };
      });

      res.json({cursos: cursosConDistrib});

    }catch(error){
      console.error("Error al obtener los cursos: ", error);
      return res.status(500).json({ error: 'Error interno al obtener cursos' });
    }
    });


router.get("/Alumno/VerHorarios/:id", async (req, res) => {
  const { id } = req.params; 
  try {

    const grupos = await bd.Grupo.findAll({
      attributes: ["id", "nombre", "id_ua", "id_prof", "cupo"],
      include: [
        {
          model: bd.Unidad_Aprendizaje,
          attributes: ["id", "nombre"],
        },
        {
          model: bd.DatosPersonales,
          attributes: ["id", "nombre", "ape_paterno", "ape_materno", "calificacion"],
        },
      ],
      raw: true,
      nest: true,
    });

    console.log('Grupos obtenidos count:', grupos.length);
    const resultado = [];

    for (const g of grupos) {
      console.log('Procesando grupo raw:', g);
      const distribuciones = await bd.Distribucion.findAll({
        where: { id_grupo: g.id },
        attributes: ["dia", "hora_ini", "hora_fin"],
        raw: true,
      });

      console.log(`Distribuciones encontradas para grupo ${g.id}:`, distribuciones.length);
      
      const dias = { Lunes: [], Martes: [], Miercoles: [], Jueves: [], Viernes: [] };
      distribuciones.forEach((d) => {
        const diaKey = d.dia === 'Miércoles' || d.dia === 'Miercoles' ? 'Miercoles' : d.dia;
        if (dias[diaKey] !== undefined) dias[diaKey].push(`${d.hora_ini}-${d.hora_fin}`);
      });

      const datosProf = g.DatosPersonale || g.DatosPersonales || {};
      resultado.push({
        id_grupo: g.id,
        id_ua: (g.Unidad_Aprendizaje && (g.Unidad_Aprendizaje.id || g.Unidad_Aprendizaje.ID)) || g.id_ua,
        nombre_ua: (g.Unidad_Aprendizaje && (g.Unidad_Aprendizaje.nombre || g.Unidad_Aprendizaje.Nombre)) || "",
        profesor: `${datosProf.nombre || ""} ${datosProf.ape_paterno || ""} ${datosProf.ape_materno || ""}`.trim(),
        calificacion_profesor: datosProf.calificacion || null,
        cupo: g.cupo,
        dias,
      });
    }

    return res.json({ filas: resultado });
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
});
  router.post("/Agregar/:id", async(req, res)=>{
    const {id} = req.params;
    const us = req.user.id;
    console.log(us);

    const cre = await bd.Estudiante.findOne({
      where: {id_usuario : us}
    });

    const cuesta = await bd.Grupo.findOne({
      where : {id : id},
      include :[{
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

          const gruposActuales = req.session.tempGrupos ||[];

          const distribuciones = await bd.Distribucion.findAll({
            attributes: ["dia", "hora_ini", "hora_fin", "id_grupo"],
            where: {
              id_grupo: [...gruposActuales, id]
            }
          });

  // distribución del nuevo grupo
          const distriNuevo = distribuciones.filter(d => d.id_grupo === id);

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
    if(parseInt(req.session.creditos, 10) < parseInt(cuesta.Unidad_Aprendizaje.credito,10)){
      return res.json({success: false, tempGrupo:req.session.tempGrupos, creditos : req.session.creditos, err : "No tienes creditos suficientes"});
    }
    else{
          req.session.creditos = parseInt(req.session.creditos, 10) - parseInt(cuesta.Unidad_Aprendizaje.credito,10)
          req.session.tempGrupos.push(id);
          console.log("Grupo guardado: ", req.session.tempGrupos);
          console.log("Creditos:" , req.session.creditos)
          return res.json({success: true, tempGrupo : req.session.tempGrupos, creditos : req.session.creditos});
    }
  } 
  });

  router.post("/Inscribirse", async(req,res)=>{

    if(req.session.tempGrupos == []){
      return res.json({success : false});
    }
    else{
      try{
        const ids = req.session.tempGrupos;
        const creditos_restantes = req.session.creditos;
        const id = req.user.id;

        console.log("IDS", ids);
        console.log("creditos restantes", creditos_restantes);
        console.log("ID US", id);

        const idh = await bd.Horario.findOne({
          where: {id_alumno : id}
        });
        const cre = await bd.Estudiante.update({
          creditos_disponibles : creditos_restantes
        }, {where: {id_usuario : id}});

        for(const g of ids){
          const id2 = uuidv4().replace(/-/g, "").substring(0, 15);
          const crear_mat_inscrita = await bd.Mat_Inscritos.create({
            id: id2,
            id_horario : idh.id,
            id_grupo : g,
            calificacion : 0
          });
          const cup_act = await bd.Grupo.findOne({
            where : {id : g}
          });

          const up_grup = await bd.Grupo.update({
            cupo : parseInt(cup_act.cupo, 10) - 1
          }, {where: {id : g}});
        }

        return res.json({success:true});
        
      }catch(err){
        console.log(err);
        return res.json({success:false});
      }
    }

  });

  router.post("/Del/:id", async(req,res)=>{
    const {id} = req.params
    const us = req.user.id;

    const cre = await bd.Estudiante.findOne({
      where: {id_usuario : us}
    });

    const cuesta = await bd.Grupo.findOne({
      where : {id : id},
      include :[{
          model: bd.Unidad_Aprendizaje,
          attributes: ["credito"]
      }],
      raw: true,
      nest: true
    });

    req.session.tempGrupos = req.session.tempGrupos.filter(g=> g != id);
    req.session.creditos = parseInt(req.session.creditos, 10) + parseInt(cuesta.Unidad_Aprendizaje.credito,10)


    console.log("Grupo sin el elemento ", req.session.tempGrupos);
    console.log("Creditos:" , req.session.creditos)
    res.json({success: true, tempGrupo : req.session.tempGrupos, creditos : req.session.creditos});
  });

  router.get("/ConsultarBorrador", async(req,res)=>{
    try{
      const borr = await bd.Borrador_Horario.findAll({
        where:{id_alumno : req.user.id},
        include :[{
          model: bd.DatosPersonales,
          attributes : ["nombre", "ape_paterno", "ape_materno"],
          as : 'profesor'
        },
        {
          model: bd.Grupo,
          attributes: ["nombre", "cupo"]
        }
      ]
      });

      return res.json({horario : borr});
    }
    catch(err){
      console.log(err);
    }
  })
  router.post("/AgregarBorrador/:id", async (req, res) => {
  try {
    const us = req.user.id;
    const { id } = req.params;
    const id2 = uuidv4().replace(/-/g, "").substring(0, 15);
    let val = 1;

    //Obtener grupo, profesor y materia
    const grupo = await bd.Grupo.findOne({ where: { id } });
    const ua = await bd.Unidad_Aprendizaje.findOne({ where: { id: grupo.id_ua } });
    const dat = await bd.DatosPersonales.findOne({ where: { id: grupo.id_prof } });

    // Distribución del grupo que se va a agregar
    const distriNuevo = await bd.Distribucion.findAll({ where: { id_grupo: id } });

    // Obtener todos los grupos del borrador del usuario actual
    const borradores = await bd.Borrador_Horario.findAll({ where: { id_alumno: us } });

    if (borradores && borradores.length > 0) {
      //Obtener los id_grupo actuales del borrador
      const idsGruposUsuario = borradores.map(t => t.id_grupo);

      // Obtener sus distribuciones
      const distribucionesExistentes = await bd.Distribucion.findAll({
        where: { id_grupo: idsGruposUsuario }
      });

      // Verificar traslapes
      for (const dis of distriNuevo) {
        for (const dis2 of distribucionesExistentes) {
          if (seTraslapan(dis, dis2)) {
            val = 0;

            // Marcar el grupo existente como no válido
            await bd.Borrador_Horario.update(
              { valido: 0 },
              { where: { id_grupo: dis2.id_grupo, id_alumno: us } }
            );
          }
        }
      }
    }

    // Armar las horas por día
    let lun, mar, mier, jue, vie;
    for (const g of distriNuevo) {
      const horas = `${g.hora_ini} - ${g.hora_fin}`;
      if (g.dia === "Lunes") lun = horas;
      else if (g.dia === "Martes") mar = horas;
      else if (g.dia === "Miercoles") mier = horas;
      else if (g.dia === "Jueves") jue = horas;
      else if (g.dia === "Viernes") vie = horas;
    }

    // Crear el nuevo registro en borrador
    const borr = await bd.Borrador_Horario.create({
      id: id2,
      id_grupo: id,
      id_alumno: us,
      id_profesor: grupo.id_prof,
      calificacion: dat.calificacion,
      materia: ua.nombre,
      horas_lun: lun,
      horas_mar: mar,
      horas_mie: mier,
      horas_jue: jue,
      horas_vie: vie,
      creditos_necesarios: ua.credito,
      valido: val
    });

    return res.json({
      success: true,
      message: val
        ? "Grupo agregado correctamente sin traslapes."
        : "Grupo agregado, pero se detectaron traslapes. Marcado como no válido.",
      grupo: borr
    });

  } catch (error) {
    console.error("Error al agregar borrador:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});


    return router;
}
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

