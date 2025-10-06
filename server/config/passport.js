const LocalStrategy = require('passport-local').Strategy;
const {DatosPersonales} = require('../model/modelo');


module.exports = function(passport){

    passport.use('local-login', new LocalStrategy({
        usernameField : "id",
        passwordField : "contrasena",
        passReqToCallback: true,

    }, async(req, id, contrasena, done )=>{
        console.log("Intento de inicio de sesion ", id);
        try{

            const user = await DatosPersonales.findByPk(id);
            if (!user){
                console.log("Usuario no encontrado");
                return done(null, false, req.flash('loginMessage', 'Usuario no encontrado'));
            }
            const validPassword = await user.validPassword(contrasena);
            if(!validPassword){
                console.log("Contraseña incorrecta");
                return done(null, false, req.flash('loginMessage', 'Contraseña incorrecta'));

            }
            console.log("Usuario autenticado", user);
            return done(null, user);
        }catch(err){

            console.error("Error en la autenticacion: ", err);
            return done(err);
        }
    }));


    passport.serializeUser((user, done)=>{
        done(null, user.correo);
    });

    passport.deserializeUser(async(id, done)=>{
        try{
            const user = await DatosPersonales.findByPk(id);
            done(null, user);
        }
        catch(err){
            done(err, null);
        }
    })
}