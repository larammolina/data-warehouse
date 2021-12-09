var express = require('express');
const bcrypt = require("bcryptjs");
const app = express.Router();
const { consultarCompania, crearCompania, eliminarCompania, actualizarCompania } = require('../db/companias');

//variables de configuracion
const config = require('./../config');
const { verifyJWT, isAdmin } = require("./middlewares.js")

/** ----OK-----
 * @method - GET
 * @param - /companias/consultaCompanias
 * @description - Consulta todas las companias
 */
app.get("/consultaCompanias", verifyJWT, async (req, res) => {
    try {
        let companias = await consultarCompania();
        if (companias) {
            res.status(200).send({ datos: companias });
        } else {
            res.status(401).send({ msg: "Error al consultar companias" });
        }
    } catch(err) {
        res.status(500).json('Error al obtener companias');
    }
    //res.send("Consultando...")
});

/** ----OK-----
 * @method - DELETE
 * @param - /companias/eliminarCompanias/
 * @description - Elimina una compania
 */
app.delete("/eliminarCompania/:_id", verifyJWT, async (req, res) => {
    let req_id = req.params;
    try {
        let regionesEliminadas = await eliminarCompania(req_id);
        if (regionesEliminadas) {
            res.status(200).send({ datos: regionesEliminadas });
        } else {
            res.status(401).send({ msg: "Error al eliminar la compania" });
        }
    } catch(err) {
        res.status(500).send({ err: 'Error al eliminar compania' });
    }
});


/** ----OK-----
 * @method - POST
 * @param - /compania/agregarCompania/
 * @description - Agregar una compania
 */
app.post("/agregarCompanias", verifyJWT, async (req, res) => {
    try {
        const _compania = req.body;
        //console.log("PUT /agregarRegiones")
        //console.log("Datos de regiones: " + region);
        const companiaCreada = await crearCompania(_compania);
        if (companiaCreada) {
          res.status(200).send({ id: companiaCreada._id });
        }else{
            res.status(401).send({ error: "Error creando la compania"});
        }
    } catch (error) {
        res.status(401).send({ error: "Error creando la compania....: " + error });
    }
});

/** ----OK-----
 * @method - PUT
 * @param - /compania/editarcompanias/
 * @description - Edita una compania
 */
 app.put("/editarCompania/:_id", verifyJWT, async (req, res) => {
    try {
        let companiaEditar = req.body;
        let companiaID = req.params;
        let companiaModificada = await actualizarCompania(companiaEditar, companiaID);
        //console.log(regionModificada)
        res.status(200).send({ msg: "Compania Actualizada OK!" });
    } catch (err) {
        res.status(401).send({ msg: 'Error actualizando la compania: ' + err });
    }
});

module.exports = app;