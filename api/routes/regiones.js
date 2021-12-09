var express = require('express');
const bcrypt = require("bcryptjs");
const app = express.Router();
const { consultarRegiones, actualizarRegion, crearRegion, eliminarRegion } = require('../db/regiones');
const { verifyJWT, isAdmin } = require("./middlewares.js")

//variables de configuracion
const config = require('./../config');


/** ----OK-----
 * @method - GET
 * @param - /regiones/consultaRegiones
 * @description - Consulta todas las regiones
 */
app.get("/consultaRegiones", verifyJWT, async (req, res) => {
    try {
        console.log("GET /consultaRegiones ")
        let regiones = await consultarRegiones();
        if (regiones) {
            res.status(200).send({ datos: regiones });
        } else {
            res.status(401).send({ msg: "Error al consultar regiones" });
        }
    } catch(err) {
        res.status(500).jsonp({ err: 'Error al obtener regiones' });
    }
    //res.send("Consultando...")
});

/** ----OK-----
 * @method - DELETE
 * @param - /regiones/eliminarRegiones/
 * @description - Elimina una region
 */
app.delete("/eliminarRegiones/:_id", verifyJWT, async (req, res) => {
    let req_id = req.params;
    console.log(" DELETE/eliminarRegiones/:_id - " + req_id);
    try {
        let regionesBorradas = await eliminarRegion(req_id);
        if (regionesBorradas) {
            res.status(200).send({ datos: regionesBorradas });
        } else {
            res.status(401).send({ msg: "Error al eliminar region" });
        }
    } catch(err) {
        res.status(500).send({ err: 'Error al eliminar region500' });
    }
});


/** ----OK-----
 * @method - POST
 * @param - /regiones/agregarRegiones/
 * @description - Agregar una region
 */
app.post("/agregarRegiones", verifyJWT, async (req, res) => {
    try {
        const region = req.body;
        console.log("PUT /agregarRegiones")
        console.log("Datos de regiones: " + region);
        const regionCreada = await crearRegion(region);
        if (regionCreada) {
          res.status(200).send({ id: regionCreada._id });
        }else{
            res.status(400).send({ error: "Error creando la region"});
        }
    } catch (error) {
        res.status(401).send({ error: "Error creando la region....: " + error });
    }
});

/** ----OK-----
 * @method - PUT
 * @param - /regiones/editarRegiones/
 * @description - Edita una region
 */
 app.put("/editarRegiones/:_id", verifyJWT, async (req, res) => {
    try {
        let regionEditar = req.body;
        let regionID = req.params;
        let regionModificada = await actualizarRegion(regionEditar, regionID);
        //console.log(regionModificada)
        res.status(200).send({ msg: "Region Actualizada OK!" });
    } catch (err) {
        res.status(401).send({ msg: 'Error while updating the Region: ' + err });
    }
});

module.exports = app;
