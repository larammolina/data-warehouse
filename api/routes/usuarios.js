var express = require('express');
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express.Router();
const {consultarUsuarios, actualizarUsuarios, eliminarUsuario} = require("./../db/usuarios.js")

const { verifyJWT, isAdmin } = require("./middlewares.js")

//variables de configuracion
const config = require('./../config');
const User = require("./../models/usuarios");



//AGREGAR MIDDLEWARE PARA VERIFICAR EL JWT
//AGREGAR CODIGO PARA VERIFICAR JWT DEL ADMIN



/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */
/*app.post("/signup",
  [
    check("username", "Please Enter a Valid Username")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
  ],
  verifyJWT, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    const {
      username,
      email,
      password,
      
      nombre,
      apellido
    } = req.body;
    console.log(req.body)
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(401).json({
          msg: "User Already Exists"
        });
      }

      user = new User({
        username,
        email,
        password,
        
        nombre,
        apellido
      });
      console.log(user)
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.status(200).send("Usuario creado con exito")

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error guardando usuario...");
    }
  }
);*/

//ESTE ES PARA QUE SOLO EL ADMIN PUEDA VER ESRE ENDPOINT
app.post("/altaUsuario",
  [
    check("username", "Please Enter a Valid Username")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
  ],
  verifyJWT, isAdmin, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({
        errors: errors.array()
      });
    }
    const {
      username,
      email,
      password,
      perfil,
      nombre,
      apellido
    } = req.body;
    console.log("BODY: "+req.body)
    try {
      let user = await User.findOne({ email });
      if (user) {
        console.log("User Already Exists")
        return res.status(402).json({
          msg: "User Already Exists"
        });
      }

      user = new User({
        username,
        email,
        password,
        perfil,
        nombre,
        apellido
      });
      console.log(user)
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      console.log("Usuario creado OK!")
      res.status(200).send({mensaje: "Usuario creado con exito"})

    } catch (err) {
      console.log(err.message);
      res.status(500).send({mensaje: "Error guardando usuario..."});
    }
  }
);

/**
 * @method - POST
 * @param - /login
 * @description - User Login
 */

app.post("/login",
  [
    check("username", "Please enter a valid email").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(1).json({
        errors: errors.array()
      });
    }

    const { username, password } = req.body;
    try {
      let user = await User.findOne({ username });
      if (!user)
        return res.status(401).json({
          message: "User Not Exist"
        });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({
          message: "Incorrect Password !"
        });
      
        console.log(user.perfil)
      const payload = {
        user: {
          id: user.id,
          perfil: user.perfil
        }
      };

      let perf = user.perfil;

      /*
      jwt.sign(payload,  config.llave,{
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          let res = {
            token,
            payload.perfil
          }
          res.status(200).send({
            token
            
          });
        }
      );
*/
        let token = jwt.sign(payload,  config.llave,{
          expiresIn: 3600
        });

        res.status(200).send({
          perf,
          token
          
        })

    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);


/** ----OK-----
 * @method - GET
 * @param - /contactos/consultaUsuarios
 * @description - Consulta todos los Usuarios
 */
 app.get("/consultaUsuarios", verifyJWT, isAdmin, async (req, res) => {
  try {
      let usuarios = await consultarUsuarios();
      if (usuarios) {
          res.status(200).send({ datos: usuarios });
      } else {
          res.status(401).send({ msg: "Error al consultar usuarios" });
      }
  } catch(err) {
      res.status(500)('Error al obtener usuarios');
  }
});

/** ----OK-----
 * @method - PUT
 * @param - /contactos/actualizarUsuarios
 * @description - Actualiza todos los Usuarios
 */
 app.put("/actualizarUsuarios/:_id", verifyJWT, isAdmin, async (req, res) => {
  try {
      let usuarioEditar = req.body;
      let usuarioID = req.params;
      let usuarioModif = await actualizarUsuarios(usuarioEditar, usuarioID);
      if (usuarioModif) {
          res.status(200).send({ datos: usuarioModif });
      } else {
          res.status(401).send({ msg: "Error al actualizar usuarios" });
      }
  } catch(err) {
      res.status(500)('Error al obtener usuarios');
  }
});


/** ----OK-----
 * @method - DELETE
 * @param - /contactos/eliminarContacto/
 * @description - Elimina un contacto
 */
 app.delete("/eliminarUsuarios/:_id", verifyJWT, isAdmin, async (req, res) => {
  let req_id = req.params;
  try {
      let usuarioEliminado = await eliminarUsuario(req_id);
      if (usuarioEliminado) {
          res.status(200).send({ datos: usuarioEliminado });
      } else {
          res.status(401).send({ msg: "Error al eliminar el contacto" });
      }
  } catch(err) {
      res.status(500).send({ err: 'Error al eliminar el contacto.' });
  }
});

module.exports = app;