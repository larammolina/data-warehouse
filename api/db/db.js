const mongoose = require("mongoose");
//variables de configuracion
const config = require('./../config');

//let DB_MONGO = 'mongodb://' + config.MONGO_CREDENCIALES + '@' + config.MONGO_ADDRESS + '/datos';
let DB_MONGO = 'mongodb://' + config.MONGO_ADDRESS + '/datawarehouse';

const iniciarMongoDB = async () => {
  try {
    await mongoose.connect(DB_MONGO, {useNewUrlParser: true});
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = iniciarMongoDB;