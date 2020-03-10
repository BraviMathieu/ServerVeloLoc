const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let MarqueSchema = new Schema({
    nom: {
        type: String,
        required : true
    },
});
mongoose.model('Marque', MarqueSchema);

module.exports = exports = MarqueSchema;
