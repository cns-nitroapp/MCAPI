var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();
// Require createDocument from utils/database
var { createDocument, getLastNDocuments, getDocument } = require('../utils/database');

const NodeCache = require('node-cache')
const cache = new NodeCache();

// Post router with transaction data
router.post('/', function(req, res, next) {

    // Require key from env
    var key = process.env.API_KEY;

    // Check if key is valid // Authorization header
    if (req.headers.authorization !== key) {
        res.status(401).send('Unauthorized');
    } else {

        // Get data from request
        var sender = req.body.sender;
        var receiver = req.body.receiver;
        var timestamp = new Date().toISOString();
        var amount = req.body.amount;

        // Create document
        var document = {
            "sender": {
                "name": sender.name,
                "uuid": sender.uuid
            },
            "receiver": {
                "name": receiver.name,
                "uuid": receiver.uuid
            },
            "amount": amount,
            "timestamp": timestamp
        };

        // Create document in database
        createDocument("transactions", document, function(error, result) {
            if (error) {
                console.log(error);
                res.status(500).send('Internal Server Error');
            } else {
                res.status(200).send('Transaction created');
            }
        });

        res.status(200).send('Transaction created');

    }
});

router.get('/', async function(req, res, next) {

    if (cache.has(document)) {
        res.status(200).send(cache.get(document));
    } else {

    var n = 15;

    const lastNDocuments = await getLastNDocuments("transactions", n);
    var document = {
        "transactions": lastNDocuments,
        "amount": n,
        "timestamp": new Date().toISOString()
    }

    cache.set(document, document, 3600);
    res.status(200).send(document);
}

});

router.get('/:tid', async function(req, res, next) {

        var tid = req.params.tid;
    
        const data = await getDocument("transactions", "_id", ObjectId(tid));
        var document = {
            "transaction": data,
            "timestamp": new Date().toISOString()
        }
    
        res.status(200).send(document);
    
});

module.exports = router;
