// routes/rutaAdministrador.js
const express = require("express");
const bd = require("../../model/modelo");
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
module.exports = (passport) => {
  const router = express.Router();

    router.post("/RegistrarAlumno", async(req, res) => {
        const {id, nombre, apellido_p, apellido_m, fecha_nacimiento, tipo_sangre, CURP, nacionalidad, calle, numero_ex, numero_in, codigo_postal, colonia, delegacion, ciudad, telefono, correo } = req.body;

        var ano = new Date().getFullYear();
        var numeroAleatorio = Math.floor(100000 + Math.random() * 900000);
        //var id = String(ano) + String(numeroAleatorio);
        const contra = uuidv4().replace(/-/g, "").substring(0, 15);
        console.log(contra);

        carr = await bd.Carrera.findOne({
            where: {nombre: req.body.carreraSeleccionada}
        });
        const salt = await bcrypt.genSalt(10);
        const contraHashed = await bcrypt.hash(contra, salt);
        try{
            const crearAlumno = await bd.DatosPersonales.create({
            
            id: id,
            contrasena: contraHashed,
            tipo_usuario: "alumno",
            nombre: nombre,
            ape_paterno: apellido_p,
            ape_materno: apellido_m,
            fecha_nacimiento: fecha_nacimiento,
            tipo_sangre: tipo_sangre,
            CURP: CURP,
            nacionalidad: nacionalidad,
            calle: calle,
            num_exterior: numero_ex,
            num_interior: numero_in,
            codigo_postal: codigo_postal,
            colonia: colonia,
            delegacion: delegacion,
            ciudad: ciudad,
            telefono: telefono,
            email: correo, 
            carrera: carr.nombre,
            situacion: "activo"});
            const id_es = uuidv4().replace(/-/g, "").substring(0, 15);
            const crearEstudiante = await bd.Estudiante.create({

                id : id_es,
                id_usuario : crearAlumno.id,
                promedio : 0,
                creditos_disponibles : carr.creditos_iniciales,
                estado_academico : "regular"
            });
            const crearHorario = await bd.Horario.create({
                id : uuidv4().replace(/-/g, "").substring(0, 15),
                id_alumno : id
            });
            const crearKardex = await bd.Kardex.create({
                id : uuidv4().replace(/-/g, "").substring(0, 15),
                id_alumno : id,
                promedio : 0,
                situacion_academica : "regular",
                semestres_restantes : carr.duracion_max
            });
            console.log("Alumno creado: ");
            return res.json({ success: true});
        }catch(error){
            console.error("Error al crear el alumno: ", error);
            res.status(500).json({ success: false, message: "Error al crear el alumno" });
            return;
        }
        
    });

    
    router.get("/ObtenerGrupo/:id", async(req,res)=>{
        const {id} = req.params;
        try{
            const grupo = await bd.Grupo.findOne({
                where: {id: id},
                raw: true,
                nest: true
            });
            console.log("Grupo obtenido: ", grupo);
            return res.json({grupo: grupo});
        }catch(error){
            console.error("Error al obtener la informacion del grupo: ", error);
        }  
    });

    router.put("/EditarGrupo/:id",  async(req,res)=>{
        const {id} = req.body;
        const {id_prof, id_ua, turno, nombre} = req.body;
        console.log("Datos recibidos para editar el grupo: ", req.body);
        console.log("ID del grupo a editar: ", id);
        console.log("Tipo de ID:", typeof id, "Valor:", id);
        const id2 = id;
        let turn = "";
            if(turno == "Matutino"){
                turn = "M";
            }else{turn = "V";}

            const semes = await bd.Unidad_Aprendizaje.findOne({
                where: {id: id_ua}
            });
            let val = await bd.Grupo.count({
                where: {id_ua: id_ua, turno: turno}
            });
            console.log("Valor de val: ", val);
            const pref = await bd.Carrera.findOne({
                where: {nombre: semes.carrera}
            });
        try{
            const actualizarGrupo = await bd.Grupo.update({
                nombre : nombre,
                id_ua: id_ua,
                id_prof : id_prof,
                turno : turno
            },{where : {id: id2}});
        
            console.log("Grupo actualizado: ");
            return res.json({ success: true});
        }catch(error){
            console.error("Error al actualizar el grupo: ", error);
        }
    });
    router.post("/RegistrarProfesor",  async(req, res) => {
        const {grado, nombre, apellido_p, apellido_m, fecha_nacimiento, tipo_sangre, CURP, nacionalidad, calle, numero_ex, numero_in, codigo_postal, colonia, delegacion, ciudad, telefono, correo, RFC } = req.body;
        const contra = uuidv4().replace(/-/g, "").substring(0, 15);
        try{

            const CrearProfesor = await bd.DatosPersonales.create({
                id:RFC,
                contrasena: contra,
                tipo_usuario: "profesor",
                nombre: nombre,
                ape_paterno: apellido_p,
                ape_materno: apellido_m,
                fecha_nacimiento: fecha_nacimiento,
                RFC: RFC,
                tipo_sangre: tipo_sangre,
                CURP: CURP,
                nacionalidad: nacionalidad,
                calle: calle,
                num_exterior: numero_ex,
                num_interior: numero_in,
                codigo_postal: codigo_postal,
                colonia: colonia,
                delegacion: delegacion,
                ciudad: ciudad,
                telefono: telefono,
                email: correo,
                grado: grado,
                situacion: "activo"
            });
            console.log("Profesor creado: ");
            return res.json({ success: true});

        }catch(error){
            console.error("Error al crear el profesor: ", error);
        }

    });

    router.get("/ObtenerProfesores", async(req, res) => {
        
        try{
            const profesores = await bd.DatosPersonales.findAll({
                where: {tipo_usuario: "profesor"},
            });
            return res.json({profesores: profesores});

        }catch(error){
            console.error("Error al obtener los alumnos: ", error);
        }
    });

    router.get("/ObtenerAlumno/:id", async(req,res)=>{
        const {id} = req.params;

        try{    
            const alumno = await bd.DatosPersonales.findOne({
                where: {id: id, tipo_usuario: "alumno"},
                raw: true,
                nest: true
            });
            console.log("Alumno obtenido: ", alumno);
            return res.json({alumno: alumno});

        }catch(error){
            console.error("Error al obtener la informacion del alumno: ", error);
        }
    });

    router.delete("/EliminarCurso/:id", async(req,res)=>{
        const {id} = req.params;
        console.log("ID a eliminar: ", id);
        try{
            const eliminar_relacionados = await bd.Distribucion.destroy({
                where: {id_grupo: id}
            });
            const eliminarCurso = await bd.Grupo.destroy({
                where: {id: id}
            });
            console.log("Curso eliminado: ");
            return res.json({ success: true});
        }catch(error){
            console.error("Error al eliminar el curso: ", error);
        }
    });


    router.get("/ObtenerDist/:id", async(req,res)=>{
        const {id} = req.params;
        try{
            const distribucion = await bd.Distribucion.findAll({
                where: {id_grupo: id},
                raw: true,
                nest: true
            });
            return res.json({Distri: distribucion});
        }catch(error){
            console.error("Error al obtener la distribucion: ", error);
        }
    });


router.post("/AgregarDist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { id_grupo, dia, hora_ini, hora_fin } = req.body;

    console.log(dia, hora_ini, hora_fin);

    const grupoActual = await bd.Grupo.findOne({
      where: { id: id_grupo },
    });

    if (!grupoActual) {
      return res.json({ success: false, message: "Grupo no encontrado" });
    }

    const gruposMismoNombre = await bd.Grupo.findAll({
      where: { nombre: grupoActual.nombre },
      attributes: ["id"], // solo necesitamos los ids
    });

    const idsGrupos = gruposMismoNombre.map((g) => g.id);

    //  Buscar distribuciones de esos grupos en el mismo día
    const distribuciones = await bd.Distribucion.findAll({
      where: {
        id_grupo: { [Op.in]: idsGrupos },
        dia: dia,
      },
    });

    //  Validar traslape de horarios
    const conflicto = distribuciones.some((dist) => {
      // Convertimos a minutos para comparar fácilmente
      const [ini1h, ini1m] = dist.hora_ini.split(":").map(Number);
      const [fin1h, fin1m] = dist.hora_fin.split(":").map(Number);
      const [ini2h, ini2m] = hora_ini.split(":").map(Number);
      const [fin2h, fin2m] = hora_fin.split(":").map(Number);

      const ini1 = ini1h * 60 + ini1m;
      const fin1 = fin1h * 60 + fin1m;
      const ini2 = ini2h * 60 + ini2m;
      const fin2 = fin2h * 60 + fin2m;

      // hay traslape si se intersectan los intervalos
      return ini2 < fin1 && fin2 > ini1;
    });

    if (conflicto) {
      return res.json({
        success: false,
        message: "Horario ocupado: ya existe una distribución que se traslapa.",
      });
    }

    const id2 = uuidv4().replace(/-/g, "").substring(0, 15);
    await bd.Distribucion.create({
      id: id2, 
      id_grupo : id_grupo,
      dia : dia,
      hora_ini : hora_ini,
      hora_fin : hora_fin,
    });

    res.json({ success: true, message: "Distribución agregada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

    router.get("/ObtenerProfesor/:id", async(req,res)=>{
        const {id} = req.params;
        
        try{    
            const profesor = await bd.DatosPersonales.findOne({
                where: {id: id, tipo_usuario: "profesor"},
                raw: true,
                nest: true
            });
            console.log("Profesor obtenido: ", profesor);
            return res.json({profesor: profesor});
        }catch(error){
            console.error("Error al obtener la informacion del profesor: ", error);
        }
    });

    router.put("/EditarAlumno/:id",  async(req,res)=>{
        const {id} = req.params;
        const {nombre, ape_paterno, ape_materno, fecha_nacimiento, tipo_sangre, CURP, nacionalidad, calle, num_exterior, num_interior, codigo_postal, colonia, delegacion, ciudad, telefono, email, carrera} = req.body;
        try{
            const actualizarAlumno = await bd.DatosPersonales.update({
                nombre: nombre,
                ape_paterno: ape_paterno,
                ape_materno: ape_materno,
                fecha_nacimiento: fecha_nacimiento,
                tipo_sangre: tipo_sangre,
                CURP: CURP,
                nacionalidad: nacionalidad,
                calle: calle,
                num_exterior: num_exterior,
                num_interior: num_interior,
                codigo_postal: codigo_postal,
                colonia: colonia,
                delegacion: delegacion,
                ciudad: ciudad,
                telefono: telefono,
                email: email,
                carrera: carrera
            },{
                where: {id: id, tipo_usuario: "alumno"}
            });
            console.log("Alumno actualizado: ");
            return res.json({ success: true});
        }catch(error){
            console.error("Error al actualizar el alumno: ", error);
        }
    });

    router.delete("/EliminarDist/:id", async(req,res)=>{
        const {id} = req.params;
        console.log("ID a eliminar: ", id);
        try{
            const eliminarDist = await bd.Distribucion.destroy({
                where: {id: id}
            });
            console.log("Distribucion eliminada: ");
            return res.json({ success: true});
        }catch(error){
            console.error("Error al eliminar la distribucion: ", error);
        }
    });
    router.put("/EditarProfesor/:id", async(req,res)=>{
        const {id} = req.params;
        const {nombre, ape_paterno, ape_materno, fecha_nacimiento, tipo_sangre, CURP, nacionalidad, calle, num_exterior, num_interior, codigo_postal, colonia, delegacion, ciudad, telefono, email, grado, RFC} = req.body;
        try{
            const actualizarProfesor = await bd.DatosPersonales.update({
                nombre: nombre,
                ape_paterno: ape_paterno,
                ape_materno: ape_materno,
                fecha_nacimiento: fecha_nacimiento,
                tipo_sangre: tipo_sangre,
                CURP: CURP,
                nacionalidad: nacionalidad,
                calle: calle,
                num_exterior: num_exterior,
                num_interior: num_interior,
                codigo_postal: codigo_postal,
                colonia: colonia,
                delegacion: delegacion,
                ciudad: ciudad,
                telefono: telefono,
                email: email,
                grado: grado,
            },{where: {id: id, tipo_usuario: "profesor"}});
            console.log("Profesor actualizado: ");
            return res.json({ success: true});
        }catch(error){
            console.error("Error al actualizar el profesor: ", error);
        }
    });
    router.get("/ObtenerCursos", async(req,res)=>{

        try{
            const cursos = await bd.Grupo.findAll({
                include: [                     
                    {

                        model: bd.DatosPersonales,
                        atributes :["nombre", "ape_paterno", "ape_materno"]
                    },
                    {
                    
                        model: bd.Unidad_Aprendizaje,
                        atributes: ["nombre", "carrera"],
                     
                    }
                ],
                raw: true,
                nest: true
            }); 
            
            res.json({cursos: cursos});
             
        }catch(error){
            console.error("Error al obtener los cursos: ", error);
        }
    });

    router.get("/ObtenerUA", async(req,res)=>{

        try{
            const UA = await bd.Unidad_Aprendizaje.findAll();
            return res.json({UA: UA});

        }catch(error){
            console.error("Error al obtener las UA: ", error);
        }
    });


    router.delete("/EliminarAlumno/:id", async(req,res)=>{
        const {id} = req.params;
        console.log("ID a eliminar: ", id);
        try{

            const eliminarAlumno = await bd.DatosPersonales.update({
                situacion: "inactivo"
            },{
                where: {id: id, tipo_usuario: "alumno"}
            });
            console.log("Alumno eliminado: ");
            return res.json({ success: true});
        }catch(error){
            console.error("Error al eliminar el alumno: ", error);
        }
    });

    router.delete("/EliminarProfesor/:id", async(req,res)=>{
        const {id} = req.params;
        console.log("ID a eliminar: ", id);
        try{
            const eliminarProfesor = await bd.DatosPersonales.update({
                situacion: "inactivo"
            },{
                where: {id: id, tipo_usuario: "profesor"}
            });
            console.log("Profesor eliminado: ");
            return res.json({ success: true});
        }catch(error){
            console.error("Error al eliminar el profesor: ", error);
        }
    });
    router.get("/ObtenerCarreras", async(req,res)=>{

        try{
            const carreras = await bd.Carrera.findAll();
            return res.json({carreras: carreras});

        }catch(error){
            console.error("Error al obtener las carreras: ", error);
        }
    });
    router.get("/ObtenerAlumnos",  async(req,res)=>{
        try{
            const alumnos = await bd.DatosPersonales.findAll({
                where: {tipo_usuario: "alumno"}
            });
            return res.json({alumnos: alumnos});
        }catch(error){
            console.error("Error al obtener los alumnos: ", error);
        }
    });

    router.post("/RegistrarCurso",   async(req,res)=>{
        const {id_profesor, id_UA, turno, nombre,carrera } = req.body; 
        try{
            let t = "";
            if(turno == "Matutino"){
                t = "M"
            }else{ t = "V"}

            const id2 = uuidv4().replace(/-/g, "").substring(0, 15);
            const carr = await bd.Carrera.findOne({
                where: {nombre : carrera}
            });

            
            const ua = await bd.Unidad_Aprendizaje.findOne({
                where: {id : id_UA}
            });
            let name2 = String(ua.semestre) + String(carr.prefijo_grupo) + String(t) + String(nombre);
            const val = await bd.Grupo.count({
                where: {id_ua : id_UA,  nombre : name2}
            });

            if(val > 0){
                return res.json({success:false})
            }
            else{
            const crearCurso = await bd.Grupo.create({
                id: id2,
                nombre: name2,
                id_ua: id_UA,
                id_prof: id_profesor,
                turno: turno,
                cupo: 30
            });
            console.log("Curso creado: ");
            return res.json({ success: true});
        }

        }catch(error){
            console.error("Error al crear el curso: ", error);
        }


    });

   
  return router;
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}