const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//funcion para verificar si el usuario está logueado o no
exports.usuarioAutenticado = (req, res, next)=>{
    //si el usuario esta atutenticado, adelante
    if(req.isAuthenticated()){
        return next();
    }

    //si no esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');

} 

//función para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion');// al cerrar sesión nos lleva al login
    })
}

// genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
    //verificar si el usuario existe
    const {email} = req.body
    const usuario = await Usuarios.findOne({where: {email}});

    //si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/restablecer');
    }

    //El usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    //guardar token y expiracion en la BD
    await usuario.save();
    
    //url de reset
    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;

    //enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset Uptask',
        resetUrl,
        archivo: 'restablecer-password'
    });
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) =>{
    const usuario = await Usuarios.findOne({
        where: { 
            token: req.params.token
        }
    });

    //sino encuentra el usuario
    if(!usuario){
        req,flash('error', 'No Valido')
        res.redirect('/restablecer');  
    }
    
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}

//Cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) =>{
    //Verifica el token valido y la fecha de expiración
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    //verificamos si el usuario existe
    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/restablecer');
    }
    //Hashear el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    //blanqueando token y expiración
    usuario.token = null;
    usuario.expiracion = null;

    //guardamos el nuevo password
    await usuario.save();

    req.flash('correcto','Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

}