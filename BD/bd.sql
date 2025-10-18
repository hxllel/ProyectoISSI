DROP DATABASE IF EXISTS SAES;

CREATE DATABASE SAES;

USE SAES

DROP TABLE IF EXISTS datos_personales;

DROP TABLE IF EXISTS datos_medicos;

DROP TABLE IF EXISTS enfermedades;

DROP TABLE IF EXISTS estudiante;

DROP TABLE IF EXISTS unidad_de_aprendizaje;

DROP TABLE IF EXISTS grupo;

DROP TABLE IF EXISTS distribucion;

DROP TABLE IF EXISTS horario;

DROP TABLE IF EXISTS mat_inscritos;

DROP TABLE IF EXISTS inscripcion;

DROP TABLE IF EXISTS resena;

DROP TABLE IF EXISTS kardex;

DROP TABLE IF EXISTS ua_aprobada;

DROP TABLE IF EXISTS borrador_horario;

create table datos_personales (
    id varchar(15) not null,
    contrasena varchar(20) not null,
    tipo_usuario varchar(15) not null,
    nombre varchar(25) not null,
    ape_paterno varchar(25) not null,
    ape_materno varchar(25) not null,
    fecha_nacimiento date not null,
    RFC varchar(20),
    tipo_sangre varchar(15) not null,
    CURP varchar(20) not null,
    nacionalidad varchar(20) not null,
    calle varchar(20) not null,
    num_exterior varchar(20) not null,
    num_interior varchar(20) not null,
    codigo_postal varchar(20) not null,
    colonia varchar(20) not null,
    delegacion varchar(20) not null,
    telefono varchar(20) not null,
    ciudad varchar(20) not null,
    email varchar(50) not null,
    foto BLOB,
    grado varchar(50),
    carrera varchar(40),
    situacion varchar(20),
    CONSTRAINT PK_USUARIOS PRIMARY KEY (id)
);

create table datos_medicos (
    id varchar(15) not null,
    id_usuario varchar(15) not null,
    peso float not null,
    altura float not null,
    tipo_sangre varchar(5) not null,
    nss varchar(30) not null,
    CONSTRAINT PK_DM PRIMARY KEY (id),
    CONSTRAINT FK_DM_DP FOREIGN KEY (id_usuario) REFERENCES datos_personales (id)
);

create table enfermedades (
    id varchar(15) not null,
    id_dat_med varchar(15) not null,
    descri varchar(500) not null,
    CONSTRAINT PK_E PRIMARY KEY (id),
    CONSTRAINT FK_E_DM FOREIGN KEY (id_dat_med) REFERENCES datos_medicos (id)
);

create table estudiante (
    id varchar(15) not null,
    id_usuario varchar(15) not null,
    promedio float not null,
    creditos_disponibles float not null,
    estado_academico varchar(20) not null,
    constraint PK_ES PRIMARY KEY (id),
    CONSTRAINT FK_ES_DP FOREIGN KEY (id_usuario) REFERENCES datos_personales (id)
);

create table carrera (
    nombre varchar(40) not null,
    creditos_iniciales int not null,
    prefijo_grupo varchar(10) not null,
    duracion_max int not null,
    CONSTRAINT PK_CAR PRIMARY KEY (nombre)
);

create table unidad_de_aprendizaje (
    id varchar(15) not null,
    nombre varchar(25) not null,
    credito float not null,
    carrera varchar(50),
    semestre int not null,
    CONSTRAINT PK_UA PRIMARY KEY (id),
    CONSTRAINT FK_UA_CAR FOREIGN KEY (carrera) REFERENCES carrera (nombre)
);

create table grupo (
    id varchar(15) not null,
    nombre varchar(25) not null,
    id_ua varchar(15) not null,
    id_prof varchar(15) not null,
    turno varchar(15) not null,
    cupo int not null,
    CONSTRAINT PK_GRU PRIMARY KEY (id),
    CONSTRAINT FK_GRU_DP FOREIGN KEY (id_prof) REFERENCES datos_personales (id),
    CONSTRAINT FK_GRU_UA FOREIGN KEY (id_ua) REFERENCES unidad_de_aprendizaje (id)
);

create table distribucion (
    id varchar(15) not null,
    id_grupo varchar(15) not null,
    hora_ini varchar(15) not null,
    hora_fin varchar(15) not null,
    dia varchar(15) not null,
    CONSTRAINT PK_DIS PRIMARY KEY (id),
    CONSTRAINT FK_DIS_GRU FOREIGN KEY (id_grupo) REFERENCES grupo (id)
);

create table horario (
    id varchar(15) not null,
    id_alumno varchar(15) not null,
    CONSTRAINT PK_HOR PRIMARY KEY (id),
    CONSTRAINT FK_HOR_DP FOREIGN KEY (id_alumno) REFERENCES datos_personales (id)
);

create table mat_inscritos (
    id varchar(15) not null,
    id_horario varchar(15) not null,
    id_grupo varchar(15) not null,
    calificacion float,
    CONSTRAINT PK_MAT PRIMARY KEY (id),
    CONSTRAINT FK_MAT_HOR FOREIGN KEY (id_horario) REFERENCES horario (id),
    CONSTRAINT FK_MAT_GRU FOREIGN KEY (id_grupo) REFERENCES grupo (id)
);

create table inscripcion (
    id varchar(15) not null,
    id_alumno varchar(15) not null,
    fecha_hora_in timestamp not null,
    fecha_hora_cad timestamp not null,
    CONSTRAINT PK_INS PRIMARY KEY (id),
    CONSTRAINT FK_INS_DP FOREIGN KEY (id_alumno) REFERENCES datos_personales (id)
);

create table resena (
    id varchar(15) not null,
    id_profesor varchar(15) not null,
    id_alumno varchar(15) not null,
    calificacion float not null,
    comentarios varchar(200),
    fecha date not null,
    CONSTRAINT PK_RE PRIMARY KEY (id),
    CONSTRAINT FK_RE_PRO FOREIGN KEY (id_profesor) REFERENCES datos_personales (id),
    CONSTRAINT FK_RE_ALU FOREIGN KEY (id_alumno) REFERENCES datos_personales (id)
);

create table kardex (
    id varchar(15) not null,
    id_alumno varchar(15) not null,
    promedio float not null,
    situacion_academica varchar(25) not null,
    semestres_restantes int not null,
    CONSTRAINT PK_KAR PRIMARY KEY (id),
    CONSTRAINT FK_KAR_DP FOREIGN KEY (id_alumno) REFERENCES datos_personales (id)
);

create table ua_aprobada (
    id varchar(15) not null,
    id_kardex varchar(15) not null,
    unidad_aprendizaje varchar(25) not null,
    calificacion_final float not null,
    semestre int not null,
    metodo_aprobado varchar(15) not null,
    CONSTRAINT PK_UAA PRIMARY KEY (id),
    CONSTRAINT FK_UAA_KAR FOREIGN KEY (id_kardex) REFERENCES kardex (id)
);

create table borrador_horario (
    id varchar(15) not null,
    id_grupo varchar(15) not null,
    id_alumno varchar(15) not null,
    id_profesor varchar(15) not null,
    nombre varchar(25) not null,
    materia varchar(25) not null,
    horas_lun varchar(20) not null,
    horas_mar varchar(20) not null,
    horas_mie varchar(20) not null,
    horas_jue varchar(20) not null,
    horas_vie varchar(20) not null,
    creditos_necesarios float not null,
    CONSTRAINT PK_BOR PRIMARY KEY (id),
    CONSTRAINT FK_BOR_DP FOREIGN KEY (id_alumno) REFERENCES datos_personales (id),
    CONSTRAINT FK_BOR_PRO FOREIGN KEY (id_profesor) REFERENCES datos_personales (id),
    CONSTRAINT FK_BOR_GRU FOREIGN KEY (id_grupo) REFERENCES grupo (id)
);

INSERT INTO
    datos_personales (
        id,
        contrasena,
        tipo_usuario,
        nombre,
        ape_paterno,
        ape_materno,
        fecha_nacimiento,
        RFC,
        tipo_sangre,
        CURP,
        nacionalidad,
        calle,
        num_exterior,
        num_interior,
        codigo_postal,
        colonia,
        delegacion,
        ciudad,
        telefono,
        email,
        grado,
        situacion
    )
VALUES (
        '2023635321',
        'primeraprueba',
        'administrador',
        'juan',
        'perez',
        'gonzales',
        '2007-05-23',
        'ABCDEFGE',
        'O+',
        'ABCDEFG',
        'mexicana',
        'heroes',
        '15',
        'n/a',
        '12345',
        'juarez',
        'tlalpan',
        'CDMX',
        '123456',
        'juan_perez@gmail.com',
        'n/a',
        'activo'
    ),
    (
        'HIJKLMNO',
        'segundaprueba',
        'profesor',
        'maria',
        'lopez',
        'martinez',
        '1980-11-15',
        'HIJKLMNO',
        'A+',
        'HIJKLMNO',
        'mexicana',
        'revolucion',
        '45',
        'n/a',
        '67890',
        'centro',
        'coyoacan',
        'CDMX',
        '654321',
        'maria_lopez@gmail.com',
        'doctorado en ciencias',
        'activo'
    );

insert into
    carrera (
        nombre,
        creditos_iniciales,
        prefijo_grupo,
        duracion_max
    )
values (
        'Ingenieria en Sistemas Computacionales',
        25,
        'B',
        10
    );

insert into
    unidad_de_aprendizaje (
        id,
        nombre,
        credito,
        carrera,
        semestre
    )
values (
        'UA001',
        'Matematicas Discretas',
        8,
        'Ingenieria en Sistemas Computacionales',
        1
    );