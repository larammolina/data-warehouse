const { Schema, model } = require('mongoose');

const companySchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    address: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        unique: true
    },
    city: [{
        type: Schema.Types.ObjectId,
        ref: 'City'
    }]
});

const company = model('Company', companySchema);

module.exports = { companySchema: company };