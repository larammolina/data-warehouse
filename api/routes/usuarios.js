var express = require('express');
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express.Router();

const User = require("./../models/usuarios");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

//AGREGAR MIDDLEWARE PARA VERIFICAR EL JWT
//AGREGAR CODIGO PARA VERIFICAR JWT DEL ADMIN

async function verifyJWT(req, res, next) {
  const usertoken = req.headers['access-token'];
  console.log("USERTKN " + usertoken);
  if(usertoken != undefined) {
        const decoded = jwt.verify(usertoken, app.get('llave'));
        if(decoded){
          console.log(decoded);
          next();
        }else{
          res.status('401').json('Error JWT')
        }
  }else{
    res.status('401').json('Error no se envio JWT')
  }
}
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
        try {
            let user = await User.findOne({email});
            if (user) {
                return res.status(400).json({
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

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };
/*
            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
*/
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
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
        let user = await User.findOne({username});
        if (!user)
          return res.status(400).json({
            message: "User Not Exist"
          });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({
            message: "Incorrect Password !"
          });
  
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign(payload, "randomString",
          {
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