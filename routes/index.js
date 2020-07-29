const express = require('express');
const router = express.Router();

//importar express-validator
//se  usa body debido a que es lo que queremos validar, revisar documentación para ver otras opciones
const { body } = require('express-validator/check');

//importar el controlador
const proyectosController = require('../controllers/proyectosControllers');

const tareasController = require('../controllers/tareasController');

const usuariosController = require('../controllers/usuariosController');

const authController = require('../controllers/authController');

// los metodo isEmpty, Trim y escape son para verificar que el string no venga vacio, eliminar los espacio al inicio y al final y evitar la insercion de caracteres especiales, revisar documentación para conocer mas metodos
module.exports = function(){
    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    );

    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );

    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    //Listar proyecto
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );

    //Actualizar el proyecto
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );


    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );

    //eliminar proyecto
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    //tareas
    router.post('/proyecto/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );

    //Actualizar tarea
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    );

    //Eliminar tarea
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );

    //Crear nueva cuenta
    router.get('/crear-cuenta',
        usuariosController.formCrearCuenta
    );
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo',usuariosController.confirmarCuenta);

    //Iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);

    router.post('/iniciar-sesion', authController.autenticarUsuario);
    
    //cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);
    
    // restablecer contraseña
    router.get('/restablecer', usuariosController.formRestablecerPassword);
    router.post("/restablecer", authController.enviarToken);
    router.get('/restablecer/:token', authController.validarToken);
    router.post('/restablecer/:token', authController.actualizarPassword);

    return router;
}