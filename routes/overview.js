var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();
var { getLastNDocuments, getGlobalStats } = require('../utils/database');

router.get('/', async function(req, res, next) {

    var n = 15;
    const lastNDocuments = await getLastNDocuments("transactions", n);
    var tdocument = {
        "transactions": lastNDocuments,
        "amount": n,
        "timestamp": new Date().toISOString()
    }

    const globaldata = await getGlobalStats();
    var gdocument = {
        "stats": globaldata,
        "timestamp": new Date().toISOString(),
    }

    res.send({
        "transactions": tdocument,
        "stats": gdocument
    }).status(200);

});

module.exports = router;