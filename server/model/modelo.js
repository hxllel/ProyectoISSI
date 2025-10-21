const{DataTypes} = require("sequelize");
const{Sequelize} = require("sequelize");
const bcrypt = require("bcryptjs");

const isProduction = process.env.NODE_ENV === 'production';



const sequelize = new Sequelize({
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: 'mysql',
  dialectOptions: isProduction,
  host: isProduction ? undefined : process.env.DB_HOST,
  port: isProduction ? undefined : parseInt(process.env.DB_PORT || '3306'),
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});


const DatosPersonales = sequelize.define("DatosPersonales", {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    contrasena: { type: DataTypes.STRING(200), allowNull: false },
    tipo_usuario: { type: DataTypes.STRING(15), allowNull: false },
    nombre: { type: DataTypes.STRING(25), allowNull: false },
    ape_paterno: { type: DataTypes.STRING(25), allowNull: false },
    ape_materno: { type: DataTypes.STRING(25), allowNull: false },
    fecha_nacimiento: { type: DataTypes.DATE, allowNull: false },
    RFC: { type: DataTypes.STRING(50) },
    tipo_sangre: { type: DataTypes.STRING(15), allowNull: false },
    CURP: { type: DataTypes.STRING(50), allowNull: false },
    nacionalidad: { type: DataTypes.STRING(50), allowNull: false },
    calle: { type: DataTypes.STRING(50), allowNull: false },
    num_exterior: { type: DataTypes.STRING(50), allowNull: false },
    num_interior: { type: DataTypes.STRING(50), allowNull: false },
    codigo_postal: { type: DataTypes.STRING(50), allowNull: false },
    colonia: { type: DataTypes.STRING(50), allowNull: false },
    delegacion: { type: DataTypes.STRING(50), allowNull: false },
    ciudad: { type: DataTypes.STRING(50), allowNull: false },
    telefono: { type: DataTypes.STRING(50), allowNull: false },
    email: { type: DataTypes.STRING(50), allowNull: false },
    foto: { type: DataTypes.BLOB},
    grado: { type: DataTypes.STRING(50) },
    carrera: { type: DataTypes.STRING(40) },
    situacion:{ type: DataTypes.STRING(50) },
    calificacion:{ type: DataTypes.INTEGER }
  }, { tableName: "datos_personales", timestamps: false });

 


  const DatosMedicos = sequelize.define("DatosMedicos", {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_usuario: { type: DataTypes.STRING(15), allowNull: false },
    peso: { type: DataTypes.FLOAT, allowNull: false },
    altura: { type: DataTypes.FLOAT, allowNull: false },
    tipo_sangre: { type: DataTypes.STRING(5), allowNull: false },
    nss: { type: DataTypes.STRING(30), allowNull: false }
  }, { tableName: "datos_medicos", timestamps: false });

  DatosMedicos.associate = (models) => {
    DatosMedicos.belongsTo(models.DatosPersonales, {
      foreignKey: "id_usuario",
      targetKey: "id"
    });
  };


  const Enfermedades = sequelize.define("Enfermedades", {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_dat_med: { type: DataTypes.STRING(15), allowNull: false },
    descri: { type: DataTypes.STRING(500), allowNull: false }
  }, { tableName: "enfermedades", timestamps: false });

    Enfermedades.belongsTo(DatosMedicos, {
      foreignKey: "id_dat_med",
      targetKey: "id"
    });

  const Estudiante = sequelize.define("Estudiante", {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_usuario: {type: DataTypes.STRING(15), allowNull:false},
    promedio: {type:DataTypes.FLOAT, allowNull: false},
    creditos_disponibles: {type: DataTypes.FLOAT, allowNull: false},
    estado_academico: {type: DataTypes.STRING(50), allowNull:false}
  }, {tableName: "estudiante", timestamps:false});

    Estudiante.belongsTo(DatosPersonales, {
        foreignKey: "id_usuario",
        targetKey: "id"
    });

  const Carrera = sequelize.define("Carrera", {
    nombre: { type: DataTypes.STRING(40), primaryKey: true },
    creditos_iniciales: { type: DataTypes.INTEGER, allowNull: false },
    prefijo_grupo: { type: DataTypes.STRING(10), allowNull: false },
    duracion_max: { type: DataTypes.INTEGER, allowNull: false }
  }, {tableName: "carrera", timestamps:false});


  const Unidad_Aprendizaje  = sequelize.define("Unidad_Aprendizaje", {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    nombre : { type: DataTypes.STRING(25), allowNull:false},
    credito: { type: DataTypes.FLOAT, allowNull:false },
    carrera : { type: DataTypes.STRING(50), allowNull:false },
    semestre : { type: DataTypes.INTEGER, allowNull:false }
  }, {tableName: "unidad_de_aprendizaje", timestamps:false});
  Unidad_Aprendizaje.associate=(models)=>{
    Unidad_Aprendizaje.belongsTo(models.Carrera, {
        foreignKey: "carrera",
        targetKey: "nombre"
    });
  }

  const Grupo = sequelize.define("Grupo", {
    id: { type: DataTypes.STRING(15), primaryKey: true},
    nombre: { type: DataTypes.STRING(25), allowNull: false},
    id_ua: { type: DataTypes.STRING(15), allowNull:false, references: {}},
    id_prof: {type: DataTypes.STRING(15), allowNull: false},
    turno: {type: DataTypes.STRING(15), allowNull: false},
    cupo: {type: DataTypes.INTEGER, allowNull: false}  
  }, {tableName: "grupo", timestamps: false});

Grupo.belongsTo(Unidad_Aprendizaje, {
    foreignKey: "id_ua",
    targetKey: "id",
    onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});
Grupo.belongsTo(DatosPersonales, {
    foreignKey: "id_prof",
    targetKey: "id",
    onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});


  const Distribucion = sequelize.define("Distribucion", {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_grupo: { type: DataTypes.STRING(15), allowNull: false},
    hora_ini : {type: DataTypes.STRING(15), allowNull: false},
    hora_fin : {type: DataTypes.STRING(15), allowNull: false},
    dia : {type: DataTypes.STRING(15), allowNull: false}
  }, {tableName: "distribucion", timestamps: false});


    Distribucion.belongsTo(Grupo, {
        foreignKey: "id_grupo",
        targetKey: "id"
    });


  const Horario =sequelize.define("Horario", {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_alumno : {type: DataTypes.STRING(15), allowNull: false}
  }, {tableName : "horario", timestamps:false});

  
    Horario.belongsTo(DatosPersonales, {
        foreignKey: "id_alumno",
        targetKey: "id"
    });
  

  const Mat_Inscritos = sequelize.define("Mat_Inscritos", {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_horario : { type: DataTypes.STRING(15), allowNull: false},
    id_grupo : { type: DataTypes.STRING(15), allowNull: false},
    calificacion : {type : DataTypes.FLOAT, allowNull: false}
  }, {tableName: "mat_inscritos", timestamps: false});



    Mat_Inscritos.belongsTo(Horario, {
        foreignKey: "id_horario",
        targetKey: "id"
    });


    Mat_Inscritos.belongsTo(Grupo, {
        foreignKey: "id_grupo",
        targetKey: "id"
    });

  const Inscripcion = sequelize.define("Incripcion", {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_alumno : {type: DataTypes.STRING(15), allowNull:false},
    fecha_hora_in : {type: DataTypes.DATE(6), allowNull: false},
    fecha_hora_cad : {type: DataTypes.DATE(6), allowNull: false}
  }, {tableName: "inscripcion", timestamps: false});


  Inscripcion.belongsTo(DatosPersonales, {
        foreignKey: "id_alumno",
        targetKey: "id"
    });

  const Resena = sequelize.define("Resena", {
     id: { type: DataTypes.STRING(15), primaryKey: true },
     id_profesor: { type: DataTypes.STRING(15), allowNull: false},
     id_alumno: { type: DataTypes.STRING(15), allowNull: false },
     calificacion : {type: DataTypes.FLOAT, allowNull: false},
     comentarios: {type: DataTypes.STRING(200), allowNull: true},
     fecha: {type: DataTypes.DATE, allowNull:false}
  }, {tableName: "resena", timestamps:false});

    Resena.belongsTo(DatosPersonales, {
        foreignKey: "id_alumno",
        targetKey: "id"
    });
    Resena.belongsTo(DatosPersonales, {
        foreignKey: "id_profesor",
        targetKey: "id"
    });

const Kardex = sequelize.define("Kardex", {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_alumno: { type: DataTypes.STRING(15), allowNull: false },
    promedio : {type: DataTypes.FLOAT, allowNull: false},
    situacion_academica: {type: DataTypes.STRING(25), allowNull:false},
    semestres_restantes: {type: DataTypes.INTEGER, allowNull: false}
}, {tableName: "kardex", timestamps: false});

    Kardex.belongsTo(DatosPersonales, {
        foreignKey: "id_alumno",
        targetKey: "id"
    });

const UA_Aprobada = sequelize.define("UA_Aprobada", {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_kardex : { type: DataTypes.STRING(15), allowNull: false},
    unidad_aprendizaje : {type: DataTypes.STRING(25), allowNull: false},
    calificacion_final : {type: DataTypes.FLOAT, allowNull: false},
    semestre: {type: DataTypes.INTEGER, allowNull: false},
    metodo_aprobado: {type: DataTypes.STRING(15), allowNull: false}
}, {tableName: "ua_aprobada", timestamps: false});

    UA_Aprobada.belongsTo(Kardex, {
        foreignKey: "id_kardex",
        targetKey: "id"
    });


    const Borrador_Horario = sequelize.define("Borrador_Horario", {
        id: { type: DataTypes.STRING(15), primaryKey: true },
        id_grupo : { type: DataTypes.STRING(15), allowNull: false},
        id_alumno : {type: DataTypes.STRING(15), allowNull: false},
        id_profesor : {type: DataTypes.STRING(15), allowNull: false},
        calificacion : {type: DataTypes.STRING(25), allowNull: false},
        materia : {type: DataTypes.STRING(25), allowNull: false},
        horas_lun: {type: DataTypes.STRING(50), allowNull: true},
        horas_mar: {type: DataTypes.STRING(50), allowNull: true},
        horas_mie: {type: DataTypes.STRING(50), allowNull: true},
        horas_jue: {type: DataTypes.STRING(50), allowNull: true},
        horas_vie: {type: DataTypes.STRING(50), allowNull: true},
        creditos_necesarios: {type: DataTypes.FLOAT, allowNull: false},
        valido :  {type: DataTypes.INTEGER, allowNull: false, defaultValue:true}
      }, {tableName : "borrador_horario", timestamps:false});

      Borrador_Horario.belongsTo(DatosPersonales, {
        foreignKey: "id_alumno",
        targetKey: "id",
        as: 'alumno'
    });
    Borrador_Horario.belongsTo(DatosPersonales, {
        foreignKey: "id_profesor",
        targetKey: "id",
        as : 'profesor'
    });
    Borrador_Horario.belongsTo(Grupo, {
        foreignKey: "id_grupo",
        targetKey: "id"
    });
  

async function SincronizarModelo(){
  try{
    await DatosPersonales.sync();
    await DatosMedicos.sync();
    await Enfermedades.sync();
    await Estudiante.sync();
    await Unidad_Aprendizaje.sync();
    await Grupo.sync();
    await Distribucion.sync();
    await Horario.sync();
    await Mat_Inscritos.sync();
    await Inscripcion.sync();
    await Resena.sync();
    await Kardex.sync();
    await UA_Aprobada.sync();
    await Borrador_Horario.sync();
    console.log("Los modelos fueron sincronizados correctamente");

  }catch(err){
    console.error("Error al sincronizar", err);
  }
}

DatosPersonales.prototype.validPassword = async function (password) {
  console.log("Intentando validar contraseña:", password);
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("Contraseña hasheada:", hashedPassword);
  console.log("Hash almacenado:", this.contrasena);
  try {
    const result = bcrypt.compareSync(password, this.contrasena);
    console.log("Resultado de la comparación:", result);
    return result;
  } catch (error) {
    console.error("Error al validar contraseña:", error);
    return false;
  }
};
SincronizarModelo();
module.exports = {
    sequelize,
    DatosPersonales,
    DatosMedicos,
    Enfermedades,
    Estudiante,
    Unidad_Aprendizaje,
    Grupo,
    Distribucion,
    Horario,
    Mat_Inscritos,
    Inscripcion,
    Resena,
    Kardex,
    UA_Aprobada,
    Carrera,
    Borrador_Horario

};