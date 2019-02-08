var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");



//ROOT - SHOW LANDING (MIGHT REMOVE)
router.get("/", function(req, res){
    res.render("landing.ejs");
});



// SHOW REGISTER FORM
router.get("/register", function(req, res){
   res.render("register.ejs"); 
});



// FIRST TIME SIGN UP - ADD USER TO DB
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    // Pass password as arg to register to be hashed by passport
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            //try again
            return res.render("register.ejs");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Coffee Critic " + user.username);
           res.redirect("/shops"); 
        });
    });
});



// SEND LOGIN FORM
router.get("/login", function(req, res){
   res.render("login.ejs"); 
});



// LOGIN - PASSPORT
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/shops",
        failureRedirect: "/login"
    }), function(req, res){
});

// LOGOUT ROUTE
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/shops");
});



module.exports = router;