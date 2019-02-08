// INCLUDE REQUIRED MODELS -- NEEDED FOR AUTH
var Campground = require("../models/shop");
var Comment = require("../models/comment");

var middlewareObj = {};

// MIDDLEWARE FUNCTION TO QUERY THE DATABASE FOR THE SHOP PULLED FROM 
// REQUEST PARAMS AND AUTHENTICATE OWNERSHIP -> PASSES ALONG QUERY
middlewareObj.checkShopOwnership = function(req, res, next) {
 // Session check
 if(req.isAuthenticated()){
        Campground.findOne({"_id": req.params.id}, function(err, queriedShop){
           if(err){
               req.flash("error", "Shop not found");
               res.redirect("back");
           }  else {
               // Shop is in db - verify ownership
            if(queriedShop.author.id.equals(req.user._id)) {
                next(); //pass to next callback
            } else {
                // User attempting to access something they did not create
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        // User not logged in
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


// MIDDLEWARE FUNCTION TO QUERY THE DATABASE FOR THE SHOP PULLED FROM 
// REQUEST PARAMS AND AUTHENTICATE OWNERSHIP -> PASSES ALONG QUERY
middlewareObj.checkCommentOwnership = function(req, res, next) {
 //session check
 if(req.isAuthenticated()){
        Comment.findOne({"_id": req.params.comment_id}, function(err, queriedComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(queriedComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;