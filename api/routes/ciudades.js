var express = require('express');
const bcrypt = require("bcryptjs");
const app = express.Router();
const { actualizarCiudad, crearCiudad, eliminarCiudad } = require('../db/ciudades');

//variables de configuracion
const config = require('../config');
const { verifyJWT, isAdmin } = require("./middlewares.js")

/** ----OK----
 * @method - PUT
 * @param - /ciudades/editarCiudades/
 * @description - Edita un pais
 */
 app.put("/editarCiudades/:_id", verifyJWT, async (req, res) => {
    try {
        let ciudadModificar = req.body;
        const ciudadID = req.params;
        const ciudadMOdif = await actualizarCiudad(ciudadModificar, ciudadID);
        if (ciudadMOdif) {
            res.status(200).send({ msj: "Ciudad modificadad OK!" });
        }
    } catch (err) {
        res.status(401).send({ msg: 'Error moficando ciudad: ' + err });
    }
});


/** ----OK----
 * @method - POST
 * @param - /regiones/agregarPais/
 * @description - Agregar un pais
 */
 app.post("/agregarCiudad/:_id", verifyJWT, async (req, res) => {
    try {
        const ciudad = req.body;
        const ID_CIUDAD = req.params;
        console.log("Pais -> " + ciudad + " -- "+ ID_CIUDAD);
        const ciudadCreada = await crearCiudad(ciudad, ID_CIUDAD);
        if (ciudadCreada) {
            res.status(200).send({ id: ciudadCreada._id });
        }
    } catch (error) {
        res.status(401).send({ error: "Error creando la ciudad....: " + error });
    }
});

/** ---- ----
 * @method - DELETE
 * @param - /regiones/eliminarPaises/
 * @description - Elimina un pais
 */
 app.delete("/eliminarCiudades/:_id", verifyJWT, async (req, res) => {
    try {
        let ciudadID = req.params;
        let ciudadEliminada = await eliminarCiudad(ciudadID);
        if (ciudadEliminada) {
            res.status(200).send({ id: ciudadEliminada._id });
        }
    } catch (error) {
        res.status(401).send({ msg: 'Error eliminando ciduad: ' + error });
    }
});


module.exports = app; 
