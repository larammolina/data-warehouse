const mongoose = require('mongoose')
var express = require('express');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require("path");

//variables de configuracion
const config = require('./config');

//inicir mongo DB
const iniciarMongoDB = require('./db/db.js');

//endpoint usuario
const user = require("./routes/usuarios"); //new addition

//endpoint api
const endpoints = require("./routes/endpoints"); //new addition


iniciarMongoDB();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', __dirname + '/views');
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//JWT
app.set('llave', config.llave);

//app.set('llave', config.llave); //JWT

app.listen(config.API_PORT, () => {
    console.log(`API REST corriendo en HTTP localhost:${config.API_PORT}`)

})

/**
 * Router Middleware
 * Router - /user/*
 * Method - *
 */
 app.use("/user", user);

 app.use("/", endpoints);
