var express = require('express');
const bcrypt = require("bcryptjs");
const app = express.Router();
const { actualizarContacto, crearContactos, eliminarContacto, consultarContactos, buscarContactos } = require('../db/contactos');

//variables de configuracion
const config = require('../config');
const { verifyJWT, isAdmin } = require("./middlewares.js");
const { serializeUser } = require('passport');

/** ----OK----
 * @method - PUT
 * @param - /contactos/editarContacto/
 * @description - Edita un contacto
 */
 app.put("/editarContacto/:_id", verifyJWT, async (req, res) => {
    try {
        let contactoModificar = req.body;
        console.log(contactoModificar)
        const contactoID = req.params;
        const contactoModificado = await actualizarContacto(contactoModificar, contactoID);
        if (contactoModificado) {
            res.status(200).send({ msj: "Contacto modificadad OK!" });
        }
    } catch (err) {
        res.status(401).send({ msg: 'Error moficando contacto: ' + err });
    }
});


/** ----OK-----
 * @method - GET
 * @param - /contactos/consultaContactos
 * @description - Consulta todos los Contactos
 */
 app.get("/consultaContactos", verifyJWT, async (req, res) => {
    try {
        let contactos = await consultarContactos();
        if (contactos) {
            res.status(200).send({ datos: contactos });
        } else {
            res.status(401).send({ msg: "Error al consultar contactos" });
        }
    } catch(err) {
        res.status(500)('Error al obtener contactos');
    }
});

/** ----OK-----
 * @method - DELETE
 * @param - /contactos/eliminarContacto/
 * @description - Elimina un contacto
 */
app.delete("/eliminarContacto/:_id", verifyJWT, async (req, res) => {
    let req_id = req.params;
    try {
        let contactoEliminado = await eliminarContacto(req_id);
        if (contactoEliminado) {
            res.status(200).send({ datos: contactoEliminado });
        } else {
            res.status(401).send({ msg: "Error al eliminar el contacto" });
        }
    } catch(err) {
        res.status(500).send({ err: 'Error al eliminar el contacto.' });
    }
});


/** ----OK-----
 * @method - POST
 * @param - /compania/agregarCompania/
 * @description - Agregar una compania
 */
app.post("/agregarContacto", verifyJWT, async (req, res) => {
    try {
        const _contacto = req.body;
        console.log(_contacto)
        const contactoreado = await crearContactos(_contacto);
        if (contactoreado) {
          res.status(200).send({ id: contactoreado._id });
        }else{
            res.status(401).send({ error: "Error creando el contacto"});
        }
    } catch (error) {
        res.status(401).send({ error: "Error creando el contacto....: " + error });
    }
});

// Busqueda de contactos con odern
app.get('/busqueda/:campo&:orden&:valor', async (req, res) => {
    try {
        let campo = req.params.campo;
        let orden = req.params.orden;
        let valor = req.params.valor;
        console.log("Campo: "+campo + "Orden: "+orden + "Valor: "+valor)
        const busquedaContactos = await buscarContactos(campo, orden, valor);
        if (busquedaContactos) {
            res.status(200).send({ resultado: busquedaContactos});
        }
    } catch (error) {
        res.status(401).send("Error en la busqueda...");
    }
});

module.exports = app;