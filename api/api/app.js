const mongoose = require('mongoose')
var express = require('express');
//var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require("path");

//variables de configuracion
const config = require('./config');

//inicir mongo DB
const iniciarMongoDB = require('./db/db.js');

//endpoint usuario
const user = require("./routes/usuarios");
//endpoint api general
const home = require("./routes/home");
//endpoint api consultas
const regiones = require("./routes/regiones");
const paises = require("./routes/paises");
const ciudades = require("./routes/ciudades");
const companias = require("./routes/companias");
const contactos = require("./routes/contactos");


iniciarMongoDB();   //Inicio mongodb
const app = express();  //inicio express

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

//JWT
app.set('llave', config.llave);

app.listen(config.API_PORT, () => {
    console.log(`API REST corriendo en HTTP localhost:${config.API_PORT}`)

})

//defino las rutas
app.use("/user", user);
app.use("/", home);
app.use("/regiones", regiones);
app.use("/paises", paises);
app.use("/ciudades", ciudades);
app.use("/companias", companias);
app.use("/contactos", contactos);
