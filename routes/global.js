var express = require('express');
var router = express.Router();
// Require createDocument from utils/database
var createDocument = require('../utils/database').createDocument;

// Post router with transaction data
router.post('/', function(req, res, next) {

    // Require key from env
    var key = process.env.API_KEY;

    // Check if key is valid // Authorization header
    if (req.headers.authorization !== key) {
        res.status(401).send('Unauthorized');
    } else {

        // Get data from request
        var total = req.body.total;
        var average = req.body.average;
        var amount = req.body.amount;
        var timestamp = new Date().toISOString();

        // Create document
        var document = {
            "total": total,
            "average": average,
            "amount": amount,
            "timestamp": timestamp,
        };

        // Create document in database
        createDocument("global", document, function(error, result) {
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

module.exports = router;