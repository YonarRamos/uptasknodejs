const express = require('express');
const routes= require('./routes/index');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
// extraer valores de variables.env
require('dotenv').config({path: 'variables.env'});

//helpers con algunas funciones
const helpers = require('./helpers');

//Crear la conexion a la BD
const db = require('./config/db');

//Importar el modelo y establecer la estructa de la BD según ese modelo definido
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(()=>{console.log('Conectado al servidor')})
    .catch((error)=>{console.log(error)});
//crear una apliacion de express
const app = express();

//Donde cargar los arvhivos express
app.use(express.static('public'));

//habilitar pug
app.set('view engine', 'pug');

//Habilitar body parser para leer datos del formulario
app.use(bodyParser.urlencoded({extended:true}));

//agregamos express validator a toda la aplicación
app.use(expressValidator());

//añadir la carpeta de las vistas
app.set('views',path.join(__dirname,'./views'));

//agregar flash - messages
app.use(flash());

app.use(cookieParser());

//Nos permite navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//pasar vardump a la aplicacion
app.use((req, res, next)=> {
    console.log(req.user);
    res.locals.vardump = helpers.vardump; //res.loclas hace accesible la funcion desde cualquier parte del archivo
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

app.use('/', routes());

//servidor y puerto
//const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log('El servidor esta funcionando');
});