const express = require("express");
const SAES = require("../model/modelo");

module.exports=function(passport){
    const router = express.Router();

    router.post("/IniciarSesion", async(req,res, next)=>{
        const {usuario, contrasena, remember} = req.body;
        console.log("Usuario: ", usuario);
        console.log("Contraseña: ", contrasena)
        
        const us = await SAES.DatosPersonales.findOne({
            where: {id : usuario}});


        if(us != null){
            if(contrasena == us.contrasena){
                console.log("nivel de acceso: ", us.tipo_usuario);
                return res.json({
                    success: true,
                    nivel_acceso : us.tipo_usuario
                });
            }
            else{
                return res.json({
                    success: false,
                    nivel_acceso: null
                })
            }
        }
    });

    return router;
}