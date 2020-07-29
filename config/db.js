const sequelize = require('sequelize');
// extraer valores de variables.env
require('dotenv').config({path: 'variables.env'});

const db= new sequelize(
        process.env.BD_NOMBRE,
        process.env.BD_USER,
        process.env.BD_PASS,
        {
            host: process.env.BD_HOST,
            dialect: 'mysql',
            port: process.env.BD_PORT,
            define:{
                timestamp: false
        },
        
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },

        storage: 'path/to/database.sqlite'
    }
);

module.exports = db;