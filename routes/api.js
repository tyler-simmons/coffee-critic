var express     = require('express'),
    router      = express.Router(),
    User        = require("../models/user");

    router.get("/usernames/checkAvailability/:username", function(req, res) {
        User.count({username : req.params.username}, function(err, count) {
            if (err) {
                res.status(500).json({
                    error : 'internal error'
                })
            }
            count < 1 ? res.json({unique : true}) : res.json({unique : false})
        })
    })

module.exports = router;
