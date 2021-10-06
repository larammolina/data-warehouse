var express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express.Router();
const { consultarRegiones, actualizarRegion, crearRegion, eliminarRegion } = require('../db/regiones');

//variables de configuracion
const config = require('./../config');

async function verifyJWT(req, res, next) {
    const usertoken = req.headers['access-token'];
    console.log("USERTKN " + usertoken);
    if (usertoken != undefined) {
        jwt.verify(usertoken, config.llave, function (err, decoded) {
            if (err) {
                console.log("JWT ERR " + err);
                res.status('401').json('Error JWT')
                //next();
            } else {
                console.log("JWT OK");
                next();
            }
        });

    } else {
        res.status('401').json('Error no se envio JWT')
    }
}

/**
 * @method - GET
 * @param - /regiones/consultaRegiones
 * @description - Consulta todas las regiones
 */
app.get("/consultaRegiones", verifyJWT, async (req, res) => {
    try {
        let regiones = await consultarRegiones();
        if (regiones) {
            res.status(201).send({ datos: regiones });
        } else {
            res.status(401).send({ msg: "Error al consultar regiones" });
        }
    } catch(err) {
        res.status(500).jsonp({ err: 'Error al obtener regiones' });
    }
    //res.send("Consultando...")
});


/**
 * @method - POST
 * @param - /regiones/editarRegiones/
 * @description - Edita una region
 */
 app.post("/editarRegiones", verifyJWT, async (req, res) => {
    //console.log('index.html');
    res.send("Consultando...")
});


/**
 * @method - DELETE
 * @param - /regiones/eliminarRegiones/
 * @description - Elimina una region
 */
 app.delete("/eliminarRegiones", verifyJWT, async (req, res) => {
    //console.log('index.html');
    res.send("Consultando...")
});


/**
 * @method - PUT
 * @param - /regiones/agregarRegiones/
 * @description - Agregar una region
 */
 app.put("/agregarRegiones", verifyJWT, async (req, res) => {
    try {
        const region = req.body;
        console.log("Datos de regiones: " + region);
        const regionCreada = await crearRegion(region);
        if (regionCreada) {
          res.status(200).send({ id: regionCreada._id });
        }else{
            res.status(400).send({ error: "Error creando la region"});
        }
    } catch (error) {
        res.status(400).send({ error: "Error creando la region....: " + error });
    }
});

module.exports = app;
