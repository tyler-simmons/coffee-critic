var express     = require('express'),
    router      = express.Router(),
    Shop        = require('../models/shop'),
    middleware  = require("../middleware");

    router.get('/', function(req, res) {
        //req.params.searchParam
        let queryParam = req.query.searchParam;
        Shop.find({
            "location.city" : queryParam
        }, function(err, searchResults) {
            if (err) {
                console.log(err);
                res.send("error");
            } else {
                res.render('shops/search.ejs', {
                    searchResults: searchResults, 
                    query: queryParam
                });
            }
        })
    });

    router.get('/*', function(req, res) {
        console.log(req.query);
        res.send("test");
    })

module.exports = router;
