const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = mongoose.model('User');

function initPassport(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, cb) {
        cb(null, user.id);
    });
    passport.deserializeUser(function(id, cb) {
        User.findById(id, function(err, user) {
            cb(err, user);
        });
    });

    passport.use(new LocalStrategy(
        {
            usernameField:"email",
            passwordField:"mdp"
        },
        function(pseudo, mdp, done) {
            User.findOne({
                email: pseudo
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                if (!bcrypt.compareSync(mdp,user.mdp)) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }
    ));
    app.get('/error', (req, res) => res.send({error:"Erreur de connexion"}));

    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/error' }),
        function(req, res) {
            // SuccessRedirect
            res.send({id:req.user.id});
        });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
}

module.exports = initPassport;