const express = require('express');
const app = express();
const cors = require('cors');

require('./modules/users/users.model');

const passport =require("./passport");

app.use(cors());

app.use(function(req, res, next){
    req.data = {};
    next();
});

//bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json());

//route et model
const usersRouter = require("./modules/users/users.router");
require('./modules/users/users.model');

//mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/server-veloc', {
    useNewUrlParser: true,
    useUnifiedTopology:true
});
mongoose.connection.on('error', console.error.bind(console, 'Erreur de connexion:'));
mongoose.connection.once('open', function() {

    passport(app);
    app.use("/user", usersRouter);

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

//gestion des paiements (avec stripe)
const paiementRouter = require("./modules/paiement/paiement.router");
// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')('sk_test_F4ij4F5WEDbWeEEeKFqSxWDg0028C5S1FD');
let paymentIntent;
app.use("/secret", function(req,res,next) {
    (async () => {
        paymentIntent = await stripe.paymentIntents.create({
            amount: 1000,
            currency: 'eur',
            payment_method_types: ['card'],
            receipt_email: 'jenny.rosen@example.com',
        });
        console.log(paymentIntent);
    })();
    res.format({
        'text/plain': function () {
            res.send(paymentIntent.client_secret);
        },

        'text/html': function () {
            res.send(paymentIntent.client_secret)
        },

        'application/json': function () {
            res.send({message: paymentIntent.client_secret})
        },

        'default': function () {
            // log the request and respond with 406
            res.status(406).send('Not Acceptable')
        }
    });
});
