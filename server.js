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