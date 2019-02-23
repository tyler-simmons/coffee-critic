// =========================================== //
// /shops/... routes here - RESTful scheme     //
// =========================================== /

var express = require("express");
var router  = express.Router();
var Shop = require("../models/shop");
var middleware = require("../middleware");

// ==================================================================================== //
// router.METHOD("route", middleware, callback){}                                       //
// on http request of type METHOD to "route"                                            // 
// middleware (code runs) -> next() (called in middleware) -> callback (anonymous here) //
// ==================================================================================== //



// INDEX ROUTE - DISPLAY INDEX OF SHOPS 
router.get("/", function(req, res){
    // Generic query - get all shops from collection
    Shop.find({}, function(err, allShops){
       if(err){
           console.log(err);
       } else {
          // pass JSON object with query along 
          res.render("shops/index.ejs",{shops:allShops});
       }
    });
});



//CREATE ROUTE - ADD TO DB (MIDDLEWARE HANDLES AUTH PROMPT AND DB QUERY)
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    //compile values into JSON object
    var newShop = {name: name, image: image, description: desc, author:author}
    // Create a new campground and save to DB
    Shop.create(newShop, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to shops page
            //console.log(newlyCreated);
            res.redirect("/shops");
        }
    });
});



//NEW ROUTE - RENDER FORM TO REDIRECT TO CREATE ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("shops/new.ejs"); 
});



// SHOW ROUTE - SHOW SELECTED SHOP
router.get("/:id", function(req, res){
    //find the shop with provided ID - IMPORTANT: MUST POPULATE COMMENT ARRAY
    Shop.findOne({"_id": req.params.id}).populate("comments").exec(function(err, queriedShop){
        if(err){
            console.log(err);
        } else {
            //console.log(queriedShop);
            //render show template with that campground
            res.render("shops/show.ejs", {shop: queriedShop});
        }
    });
});



// EDIT ROUTE - RENDER FORM TO REDIRECT TO PUT ROUTE
// Validate ownership before retrieving form
router.get("/:id/edit", middleware.checkShopOwnership, function(req, res){
    Shop.findOne({"_id": req.params.id}, function(err, queriedShop){
        res.render("shops/edit.ejs", {shop: queriedShop});
    });
});



// UPDATE ROUTE (REQUIRES METHOD-OVERRIDE) - PUT REQUEST TO UPDATE SHOP DB ENTRY
router.put("/:id",middleware.checkShopOwnership, function(req, res){
    // find and update the correct shop
    Shop.findOneAndUpdate({"_id": req.params.id}, req.body.shop/*Update entire object*/, function(err, updatedCampground){
       if(err){
           res.redirect("/shops");
       } else {
           //redirect somewhere(show page)
           res.redirect("/shops/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE (REQUIRES METHOD-OVERRIDE)
router.delete("/:id",middleware.checkShopOwnership, function(req, res){
   Shop.findOneAndDelete({"_id": req.params.id}, function(err){
      if(err){
          res.redirect("/shops");
      } else {
          res.redirect("/shops");
      }
   });
});


module.exports = router;

