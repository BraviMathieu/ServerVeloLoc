const mongoose = require('mongoose');
require('./paiement.model');

const Paiement = mongoose.model('Paiement');

module.exports = {
    paiementIdParam: function (req, res, next, id) {
        Paiement.find({"_id": id }).exec(function(err, paiement) {
            if (err) {
                return next({
                    message: "Le paiement n'a pas pu être récupéré"
                });
            }
            if (paiement.length === 0) {
                return next({
                    status: 404,
                    message: "Paiement introuvable"
                });
            }
            req.data.paiement = paiement[0];
            next();
        });
    },
    sendPaiement: function (req, res) {
        res.send({paiement: req.data.paiement});
    },
    sendPaiements: function (req, res, next) {
        Paiement.find(function (err, paiements) {
            if (err) {
                return next({
                    message: "Les paiements n'ont pas pu être récupérés"
                });
            }
            res.send({
                paiements: paiements
            });
        });
    },

    updatePaiement: function (req, res, next) {
        req.data.paiement.name = req.body.name;
        req.data.paiement.save(function (err, paiementUpdated) {
            if (err) {
                return next({
                    message: "Le paiement n'a pas pu être mis à jour"
                });
            }
            req.data.paiement = paiementUpdated;
            next();
        });
    },

    newPaiement: function (req, res, next) {
        const paiement = new Paiement({
            amount: req.body.amount,
            currency: req.body.currency,
            payment_method_types: req.body.payment_method_types,
            receipt_email: req.body.receipt_email
        });

        paiement.save(function(err, paiementSaved){
            if (err) {
                next({
                    message: "Le paiement n'a pas pu être sauvegardé."
                });
            }
            res.send(paiementSaved);
        });

    },

    deletePaiement: function (req, res) {
        req.data.paiement.deleteOne(function (err, response) {
            if (err) {
                return next({message: "Le paiement n'a pas pu être supprimé."});
            }
            res.send({success: 1})
        })


    }

};
