const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let VeloSchema = new Schema({
    nomVelo: {
        type: String,
        required : true
    },
    prix:{
        type: Number,
        required:false
    },
    marque:{
        type: Schema.Types.ObjectId,
        ref: "Marque",
        required: false
    }
});
mongoose.model('Velo', VeloSchema);

module.exports = exports = VeloSchema;
