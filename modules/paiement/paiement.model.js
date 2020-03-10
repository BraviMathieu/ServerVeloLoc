const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PaiementSchema = new Schema({

   amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    payment_method_types: {
        type: Object,
        required: true
    },
    receipt_email: {
        type: String,
        required: true
    },
    client_secret: {
       type: String,
       required: true
    }

});

mongoose.model('Paiement', PaiementSchema);
module.exports = PaiementSchema;
