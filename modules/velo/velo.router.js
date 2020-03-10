var express = require('express');
const UV = require("./velo.middleware");
var router = express.Router();


router.param('veloId',UV.veloIdParam);

router.route('/').get( UV.sendVelos)
    .post(UV.creerVelo)
    .put(UV.sendVelosPrix);

router.route('/:veloId')
    .get(UV.sendVelo)
    .put(UV.updateVelo,UV.sendVelos)
    .delete(UV.deleteVelo,UV.sendVelos);





//router.route('/lesMarques/:veloMarque')
    //.get(UV.sendVelosMarque);

module.exports = router;
