const { Schema, model } = require('mongoose');

const ciudadSchema = new Schema({           //CUIDAD
    nombre: {
        type: String,
        unique: true
    }               //cuidad no esta asociada a nada
});

const paisSchema = new Schema({             //PAIS
    nombre: {
        type: String,
        unique: true
    },
    ciudades: [{    //pais tiene asociadas ciudades
        type: Schema.Types.ObjectId,
        ref: 'Ciudad'
    }]
});

const regionSchema = new Schema({           //REGION
    nombre: {
        type: String,
        unique: true
    },
    paises: [{      //region tiene aosicados paises
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