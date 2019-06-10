const express = require("express");
const router  = express.Router();
const middleware = require("../middleware");
const Shop = require("../models/shop");

router.get("/:id", middleware.isLoggedInAndCorrectProfile, function(req, res) {
    
    Shop.find({'author.username' : req.user.username}, function(err, queriedShops){
        if (err) {
            res.redirect("/shops")
        }
        //console.log(queriedShops);
        res.render('user/profile.ejs', {shops : queriedShops});
    })
    
})

module.exports = router;