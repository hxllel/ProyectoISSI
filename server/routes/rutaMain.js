const express = require("express");
const SAES = require("../model/modelo");

module.exports=function(passport){
    const router = express.Router();

    router.post(
    "/IniciarSesion",
    passport.authenticate("local-login", { failureFlash: true }), 
    (req, res) => {
      const user = req.user;

      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 3; // 3 horas
      } else {
        req.session.cookie.expires = false; 
      }

      if (user.tipo_usuario === "alumno") {
        return res.json({ success: true, tipo_usuario: "alumno", id: user.id });
      } else if (user.tipo_usuario === "profesor") {
        return res.json({ success: true, tipo_usuario: "profesor", id: user.id });
      } else {
        return res.json({ success: true, tipo_usuario: "administrador", id: user.id });
      }
    }
  );

    return router;
}