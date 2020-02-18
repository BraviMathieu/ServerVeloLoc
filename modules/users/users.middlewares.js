const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
    userIdParam:  function(req, res, next, id) {
        User.find({"_id":id}).exec(function (err,user) {
            if (err) {
                return next({
                    message: "L'utilisateur n'a pas pu être récupérés."
                });
            }
            if(user.length===0){
                return next({
                    status:404,
                    message:"Utilisateur introuvable"
                })
            }
            req.data.user = user[0];
            next();
        });
    },
    sendUser: function (req, res) {
        res.send({user: req.data.user});
    },
    sendUsers: function (req, res){
        User.find().exec(function (err,users) {
            if (err) {
                return next({
                    message: "Les utilisateurs n'ont pas pu être récupérés."
                });
            }
            res.send({
              users
            });
        });

    },
    updateUser: function(req, res, next){
        if(req.body.nom) req.data.user.nom = req.body.nom;
        if(req.body.prenom) req.data.user.prenom = req.body.prenom;
        if(req.body.mdp) req.data.user.mdp = req.body.mdp;
        if(req.body.email) req.data.user.email = req.body.email;
        req.data.user.save(function(err, userUpdated){
            if (err){
                return next({
                    message: "L'utilisateur n'a pas pu être mis à jour."
                });
            }
            req.data.user = userUpdated;
            next();
        });
    },
    newUser: function(req, res){
        //Gestion de la date pour la BDD
        let date = new Date();
        const user = new User({
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            mdp: req.body.mdp,
            dateInscription: date
        });
        User.createUser(user, function(err, user){
            if(err){ throw err; }
            res.send(user).end();
        });
    },
    deleteUser: function(req,res){
        req.data.user.deleteOne(function (err) {
            if (err){
                next({
                    message: "L'utilisateur n'a pas pu être supprimé."
                });
            }
            res.send({success:1});
        })
    },

};