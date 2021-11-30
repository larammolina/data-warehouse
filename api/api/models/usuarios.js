const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  perfil: {
    type: String,
    enum: {
      values: ['admin', 'usuario'],
      message: '{VALUE} el perfil es incorrecto'
    },
    default: "usuario",
    required: true  //admin/usuario
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
}, {
  collection: 'usuarios'
});

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);