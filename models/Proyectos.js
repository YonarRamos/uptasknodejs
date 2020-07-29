const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid');

//proyectos ser{ia el nombre de la columna que se va a crear en la BD
const Proyectos = db.define('proyectos', { 
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type:Sequelize.STRING(100),
    },

    url:{
        type:Sequelize.STRING(100),
    },
    
},{
    hooks: {
        beforeCreate(proyecto){
            const url = slug(proyecto.nombre).toLowerCase();

            proyecto.url = `${url}-${shortid.generate()}`
        }
    }
});

module.exports = Proyectos;