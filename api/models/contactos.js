const { Schema, model } = require('mongoose');

const contactoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    cargo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    compania: [{
        type: Schema.Types.ObjectId,
        ref: 'Compania',
        required: true
    }],
    region: [{
        type: Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    }],
    pais: [{
        type: Schema.Types.ObjectId,
        ref: 'Pais'
    }],
    ciudad: [{
        type: Schema.Types.ObjectId,
        ref: 'Ciudad'
    }],
    direccion: {
        type: String,
        required: true
    },
    interes: {
        type: Number,
        required: false
    },
    canalDeContacto: [{
        type: Array,
        canal: {
            type: String,
            enum: ['telefono', 'whatsapp', 'instagram', 'facebook', 'linkedin'],
        },
        cuentaDeUsuario: {
            type: String
        },
        preferencias: {
            type: String,
            enum: ['sin preferencias', 'canal favorito', 'no molestar'],
        }
    }]
});
const contacto = model('Contacto', contactoSchema);

module.exports = {
    contactoSchema: contacto
};