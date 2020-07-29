const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
const slug = require('slug');

exports.proyectosHome = async(req,res)=>{

    // console.log(res.locals.usuario);

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    res.render('index',{
        nombrePagina:'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async(req,res)=>{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    res.render('nuevoProyecto',{
        nombrePagina:'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (req,res)=>{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    //Enviar a la consola lo que el usiario escriba
    //console.log(req.body);
    //validar que tengamos algo en el input
    const { nombre } = req.body;

    let errores =[];

    if(!nombre) {
        errores.push({'texto': 'Agrega un nombre al proyecto'});
    }

    //Si hay errores
    if(errores.length > 0 ){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        });
    }else{
        //No hay errores
        //Insertar en la BD
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre , usuarioId});
        res.redirect('/');    
    }
}

exports.proyectoPorUrl = async(req, res)=>{
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});

    const proyectoPromise = Proyectos.findOne({
        where:{
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //Consultar la tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        }/* ,
        include:[
            {model: Proyectos}
        ] */
    });

    console.log(tareas);

    if(!proyecto) return next();

    //render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async(req, res)=>{
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
    
    const proyectoPromise = Proyectos.findOne({
        where:{
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //render de la vista
    res.render('nuevoProyecto',{
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req,res)=>{
    //Enviar a la consola lo que el usiario escriba
    //console.log(req.body);
    //validar que tengamos algo en el input
    const usuarioId = res.locals.usuario.id;
    const proyectos = Proyectos.findAll({where: {usuarioId}});

    const { nombre } = req.body.nombre;

    let errores =[];

    if(!nombre) {
        errores.push({'texto': 'Agrega un nombre al proyecto'});
    }

    //Si hay errores
    if(errores.length > 0 ){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        });
    }else{
        //No hay errores
        //Insertar en la BD
        
        await Proyectos.update(
            { nombre: nombre },
            {where: {id: req.params.id}
        });
        res.redirect('/');    
    }
}

exports.eliminarProyecto = async (req, res, next)=>{

    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: {url: urlProyecto}});

    if(!resultado){
        return next();
    }

    res.status(200).send('El proyecto se ha eliminado correctamente');
}