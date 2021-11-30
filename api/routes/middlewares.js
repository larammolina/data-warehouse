const jwt = require("jsonwebtoken");
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
  
async function isAdmin(req, res, next) {
    const usertoken = req.headers['access-token'];
    console.log("ISADMIN? ");
    try {
      payload = await jwt.verify(usertoken, config.llave);
    } catch (error) {
        console.log("JWT ERR " + error);
        res.status('401').json('Error JWT');
    }
    
    console.log(payload.user.perfil)
    if(payload.user.perfil == "admin"){
      console.log("PERMISOS OK");
      next();
    }else{
      console.log("PERMISOS ERR ");
      res.status('402').json('Error USUARIO. Sin Permisos');
    }
  }

  module.exports = {
    verifyJWT,
    isAdmin
  }