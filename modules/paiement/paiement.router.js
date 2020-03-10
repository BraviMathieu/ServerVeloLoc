var express = require('express');
const UM = require("./paiement.middlewares");
var router = express.Router();

router.param('paiementId', UM.paiementIdParam);

// define the home page route
router.route("/")
    .get(UM.sendPaiements)
    .post(UM.newPaiement);

router.route('/:receipt_email')
    .get(UM.sendPaiement)
    .put(UM.updatePaiement, UM.sendPaiement)
    .delete(UM.deletePaiement);

module.exports = router;
