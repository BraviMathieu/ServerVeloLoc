var express = require('express');
const UV = require("./marque.middleware");
var router = express.Router();

router.route("/").get(UV.sendMarques)
    .post(UV.creerMarque);

/*
router.param('marqueId',UV.marqueIdParam);

router.route('/').get( UV.sendMarques)
    .post(UV.creermarque)

router.route('/:marqueId')
    .get(UV.sendMarque)
    .put(UV.updateV,UV.sendVelos)
    .delete(UV.deleteVelo,UV.sendVelos);*/





//router.route('/lesMarques/:veloMarque')
    //.get(UV.sendVelosMarque);

module.exports = router;
