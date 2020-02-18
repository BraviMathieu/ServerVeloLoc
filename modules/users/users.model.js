const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    mdp:{
        type: String,
        required: true
    },
    dateInscription:{
        type: Date,
        required: true
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.mdp, salt, function(err, hash) {
            newUser.mdp = hash;
            newUser.save(callback);
        });
    });
};

module.exports.compareMdp = function(mdp, hash, callback){
    bcrypt.compare(mdp, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
};