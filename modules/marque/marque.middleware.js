const mongoose = require('mongoose');
require('./marque.model');
const Marque= mongoose.model('Marque');
module.exports = {
    sendMarques: function (req, res) {
        Marque.find().exec(function (err, marques) {
            if (err) {
                return next({
                    message: "Les marques n'ont pas pu être récupérés."
                });
            }
            res.send({
                marques: marques
            });
        });
    },
    creerMarque(req,res,) {
        const uneMarque = new Marque({
            nom: req.body.nom,

        });
        uneMarque.save(function (err, marqueSaved) {
            if (err) {
                return next({
                    message: "La marque n'a pas été ajouté"
                });
            }
            res.send(marqueSaved);
        });
    },

};
