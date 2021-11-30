var express = require('express');
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express.Router();

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
app.post("/signup",
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
);

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
      return res.status(400).json({
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
        perfil,
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
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { username, password } = req.body;
    try {
      let user = await User.findOne({ username });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist"
        });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !"
        });
      
        console.log(user.perfil)
      const payload = {
        user: {
          id: user.id,
          perfil: user.perfil
        }
      };

      jwt.sign(payload, config.llave,{
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);



module.exports = app;