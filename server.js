const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const paiementRouter = require("./modules/paiement/paiement.router");
const stripe = require('stripe')('sk_test_F4ij4F5WEDbWeEEeKFqSxWDg0028C5S1FD');
let paymentIntent;
let client_secret_stripe;

require('./modules/users/users.model');

const passport = require("./passport");

app.use(cors());

app.use(function(req, res, next){
    req.data = {};
    next();
});

//bodyParser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json());

//gestion des paiements (avec stripe)
app.use("/secret", function(req,res,next) {
    (async () => {
        paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.prix*100,
            currency: 'eur',
            payment_method_types: ['card'],
            receipt_email: req.body.email,
        });
        console.log(paymentIntent);
        client_secret_stripe = paymentIntent.client_secret;
    })();
    res.format({
        'text/plain': function () {
            res.send(client_secret_stripe);
        },

        'text/html': function () {
            res.send(client_secret_stripe)
        },

        'application/json': function () {
            res.send({message: client_secret_stripe})
        },

        'default': function () {
            // log the request and respond with 406
            res.status(406).send('Not Acceptable')
        }
    });
});

//route et model
const usersRouter = require("./modules/users/users.router");
const veloRouter=require("./modules/velo/velo.router");
const marqueRouter=require("./modules/marque/marque.router");
require('./modules/users/users.model');

//mongoose
mongoose.connect('mongodb://localhost:27017/server-veloloc', {
    useNewUrlParser: true,
    useUnifiedTopology:true
});
mongoose.connection.on('error', console.error.bind(console, 'Erreur de connexion:'));
mongoose.connection.once('open', function() {

    passport(app);
    app.use("/user", usersRouter);
    app.use("/velo",veloRouter);
    app.use("/marque", marqueRouter);
    app.use("/", paiementRouter);

    app.use(function(req, res, next){
        next({
            status: 404,
            message:"Erreur 404"
        });
    });

    app.use(function(err, req, res) {
        res.status(err.status || 500);

        let message = (err.message || "Erreur");

        res.format({
            'text/plain': function () {
                res.send(message);
            },
            'text/html': function () {
                res.send('<p>'+message+'</p>')
            },
            'application/json': function () {
                res.send({ message: message })
            },
            'default': function () {
                // log the request and respond with 406
                res.status(406).send('Not Acceptable')
            }
        });
    });

    //Port
    app.listen(3000, function(){
        console.log("Le server écoute sur le port 3000.");
    });
});
