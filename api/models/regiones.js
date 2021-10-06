const { Schema, model } = require('mongoose');

//cuidad no esta asociada a nada
const ciudadSchema = new Schema({
    nombre: {
        type: String,
        unique: true
    }
});

const paisSchema = new Schema({
    nombre: {
        type: String,
        unique: true
    },
    ciudades: [{
        type: Schema.Types.ObjectId,
        ref: 'Ciudad'
    }]
});

const regionSchema = new Schema({
    nombre: {
        type: String,
        unique: true
    },
    paises: [{
        type: Schema.Types.ObjectId,
        ref: 'Pais'
    }]
});

const ciudad = model('Ciudad', ciudadSchema);
const pais = model('Pais', paisSchema);
const region = model('Region', regionSchema);

module.exports = { 
    regionSchema: region, 
    paisSchema: pais, 
    ciudadSchema: ciudad 
};