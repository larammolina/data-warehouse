var express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express.Router();
const { actualizarPais, crearPais, eliminarPais } = require('../db/paises');

//variables de configuracion
const config = require('../config');

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

/** ----OK----
 * @method - PUT
 * @param - /paises/editarPaises/
 * @description - Edita un pais
 */
 app.put("/editarPaises/:_id", verifyJWT, async (req, res) => {
    try {
        let paisModificar = req.body;
        let paisID = req.params;
        const paisModif= await actualizarPais(paisModificar, paisID);
        if (paisModif) {
            res.status(201).send({ msj: "Pais Modificado OK" });
        }
    } catch (err) {
        res.status(400).send({ msg: 'Error modificando el pais...: ' + err });
    }
});

/** ----OK----
 * @method - POST
 * @param - /regiones/agregarPais/
 * @description - Agregar un pais
 */
 app.post("/agregarPais/:_id", verifyJWT, async (req, res) => {
    try {
        const pais = req.body;
        const ID_PAIS = req.params;
        console.log("Pais -> " + pais + " -- "+ ID_PAIS);
        const paisCreado = await crearPais(pais, ID_PAIS);
        if (paisCreado) {
            res.status(200).send({ id: paisCreado._id });
        }
    } catch (error) {
        res.status(400).send({ error: "Error creando la region....: " + error });
    }
});

/** ----OK----
 * @method - DELETE
 * @param - /regiones/eliminarPaises/
 * @description - Elimina un pais
 */
 app.delete("/eliminarPaises/:_id", verifyJWT, async (req, res) => {
    try {
        let paisID = req.params;
        let paisElimidado = await eliminarPais(paisID);
        if (paisElimidado) {
            res.status(201).send({ id: paisElimidado._id });
        }
    } catch (err) {
        res.status(400).send({ msg: 'Error eliminando pais... ' + err });
    }
});

module.exports = app;