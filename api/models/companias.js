const { Schema, model } = require('mongoose');

const companiaSchema = new Schema({
    nombre: {
        type: String,
        unique: true
    },
    direccion: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    telefono: {
        type: String,
        unique: true
    },
    ciudades: [{    //tiene asociadas ciudades
        type: Schema.Types.ObjectId,
        ref: 'Ciudad'
    }]
});
const compania = model('Compania', companiaSchema);

module.exports = { 
    companiaSchema: compania 
};