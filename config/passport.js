const passport = require('passport');
const localStrategy = require('passport-local').Strategy

//hacer referencia al modelo que vamos a autenticar.
const Usuarios = require('../models/Usuarios');

passport.use(
    new localStrategy(
        //por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done)=>{
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email: email,
                        activo: 1
                    }
                });
                //El usuario existe pero el password es incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    })
                }
                //El email existe y password es correcto
                return done(null, usuario);
            } catch (error) {
               //Ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe o no ha sido activada'
                })
            } 
        }

    )
);

//Serializar el usuario
passport.serializeUser((usuario, callback) =>{
    callback(null, usuario);
});
//Deserializar el usuario
passport.deserializeUser((usuario, callback) =>{
    callback(null, usuario);
});

module.exports = passport;

