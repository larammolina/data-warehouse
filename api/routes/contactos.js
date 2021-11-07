var express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express.Router();
const { actualizarContacto, crearContactos, eliminarContacto, consultarContactos } = require('../db/contactos');

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
 * @param - /contactos/editarContacto/
 * @description - Edita un contacto
 */
 app.put("/editarContacto/:_id", verifyJWT, async (req, res) => {
    try {
        let contactoModificar = req.body;
        const contactoID = req.params;
        const contactoModificado = await actualizarContacto(contactoModificar, contactoID);
        if (contactoModificado) {
            res.status(201).send({ msj: "Contacto modificadad OK!" });
        }
    } catch (err) {
        res.status(400).send({ msg: 'Error moficando contacto: ' + err });
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
            res.status(201).send({ datos: contactos });
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
            res.status(201).send({ datos: contactoEliminado });
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
        const contactoreado = await crearContactos(_contacto);
        if (contactoreado) {
          res.status(200).send({ id: contactoreado._id });
        }else{
            res.status(400).send({ error: "Error creando el contacto"});
        }
    } catch (error) {
        res.status(400).send({ error: "Error creando el contacto....: " + error });
    }
});

module.exports = app;