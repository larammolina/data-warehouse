const express = require("express");
const router = express.Router();
const path = require("path");

//const app = express();


/**
 * @method - GET
 * @param - /
 * @description - api welcome
 */



router.get("/", (req, res) => {
    console.log('index.html');
    //res.render("index.html");
    res.sendFile('index.html', {root : __dirname + './../views'});
});

//MIDDELWARE TOKEN LOGUEO



router.get("/home", (req, res) => {
    console.log('users.html');
    //res.render("index.html");
    res.sendFile('users.html', {root : __dirname + './../views'});
});



module.exports = router;