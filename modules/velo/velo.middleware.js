const mongoose = require('mongoose');
require('./velo.model');
const Velo= mongoose.model('Velo')
module.exports = {
    veloIdParam :  function (req, res,next,id) { // id = :userId = req.params.userId
        Velo.find({"_id":id}).populate("marque").exec(function (err,velo) {
            if (err) {
                next({
                    message: "Le vélo n'a pas pu être récupéré."

                });
            }
            if(velo.length===0){
                return next({
                    status:404,
                    message:"vélo introuvable"
                })
            }
            req.data.velo = velo[0];
            next();
        });

    },
    sendVelo:function(req,res){
        res.send({velo: req.data.velo});
    },
    sendVelos: function (req, res,next) {
        Velo.find().populate("marque").exec(function (err, velos) {
            if (err) {
                return next({
                    message: "Les vélos n'ont pas pu être récupérés."
                });
            }
            res.send({
                velos: velos
            });
        });
    },
    sendVelosMarques: function (req, res) {
        Velo.find().exec(function (err, velos) {
            if (err) {
                return next({
                    message: "Les vélos n'ont pas pu être récupérés."
                });
            }
            res.send({
                velos: velos.marque
            });
        });
    },
    sendVelosPrix: function(req,res){
      Velo.find({prix: req.body.prix}).exec(function(err,velos){
          if (err) {
              return next({
                  message: "Les vélos n'ont pas pu être récupérés."
              });
          }
          res.send({
              velos: velos
          });
        });
    },
    creerVelo(req,res,) {
        const unVelo = new Velo({
            nomVelo: req.body.nomVelo,
            prix:req.body.prix,
            image:req.body.image,
            marque:req.body.marque
        });
        unVelo.save(function (err, veloSaved) {
            if (err) {
                return next({
                    message: "Le vélo n'a pas été ajouté"
                });
            }
            res.send(veloSaved);
        });
    },
    updateVelo: function(req,res,next){
        if(req.body.nomVelo !== null && req.body.nomVelo !== undefined){
            req.data.velo.nomVelo = req.body.nomVelo;
        }
        if(req.body.prix !== null && req.body.prix !== undefined){
            req.data.velo.prix = req.body.prix;
        }
        req.data.velo.save(function (err,userUpdated) {
            if (err) {
                next({
                    message: "L'utilisateur n'a pas pu être mis à jour."
                });
            }
            req.data.velo = userUpdated;
            next();
        })
    },
    deleteVelo:function(req,res){
        req.data.velo.deleteOne(function (err) {
            if (err){next({
                message: "L'utilisateur n'a pas pu être supprimé."
            });
            }
            res.send({success:1});
        })
    },
    sendVelosMarque: function(req,res){
        Velo.find({"marque":req.params.veloMarque}).exec(function (err,velo) {
            if (err) {
                next({
                    message: "La marque n'a pas pu être récupéré."

                });
            }
            res.send({
                marque: velo
            });
        });
    },
    veloNomParam :  function (req, res,next,nom) { // id = :userId = req.params.userId
        Velo.find({"nomVelo":nom}).exec(function (err,velo) {
            if (err) {
                next({
                    message: "L'utilisateur n'a pas pu être récupéré."

                });
            }
            if(velo.length===0){
                return next({
                    status:404,
                    message:"Utilisateur introuvable"
                })
            }
            req.data.velo = velo[0];
            next();
        });

    },
    sendVeloNom:function(req,res){
        res.send({velo: req.data.velo});
    },

};
