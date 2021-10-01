const { Schema, model } = require('mongoose');

const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    company: [{
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }],
    region: [{
        type: Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    }],
    country: [{
        type: Schema.Types.ObjectId,
        ref: 'Country'
    }],
    city: [{
        type: Schema.Types.ObjectId,
        ref: 'City'
    }],
    address: {
        type: String,
        required: true
    },
    interest: {
        type: Number,
        required: true
    },
   contactChannel: [{
        type: Array,
        channel: {
            type: String,
            enum: ['phone', 'whatsapp', 'linkedin', 'instagram', 'facebook'],
        },
        userAccount: {
            type: String
        },
        preferences: {
            type: String,
            enum: ['favorite', 'do not bother', 'No preference'],
        }
    }]
});

const contact = model('Contact', contactSchema);

module.exports = { contactSchema: contact };