// =========================================== //
// /shops/... routes here - RESTful scheme     //
// =========================================== /

var express = require("express");
var router  = express.Router();
var Shop = require("../models/shop");
var middleware = require("../middleware");
const googleMapsClient = require('@google/maps').createClient({
    key: process.env.API_KEY
});


// ==================================================================================== //
// router.METHOD("route", middleware, callback){}                                       //
// on http request of type METHOD to "route"                                            // 
// middleware (code runs) -> next() (called in middleware) -> callback (anonymous here) //
// ==================================================================================== //



//middleware to get google geocode API response
//sets the response object to res.locals
function getCoordinates(req, res, next) {
    //foramt address line from form body input
    let addrStr = `${req.body.street} ${req.body.city}, ${req.body.state}, ${req.body.zip}`
    googleMapsClient.geocode({
        address : addrStr
    }, function(err, response) {
        if (!err) {
            //store response and forward
            res.locals.googleApiResponse = response.json;
            next();
        } else {
            next(err);
        }
    });
}



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
router.post("/", middleware.isLoggedIn, getCoordinates ,function(req, res){
    
    //get coordinates from middleware
    let coordinates = res.locals.googleApiResponse.results[0].geometry.location;
    
    //build new shop object
    let newShop = {
        name : req.body.name,
        image : req.body.image,
        description : req.body.description,
        menu : req.body.menu,
        author : {
            id : req.user._id,
            username : req.user.username
        },
        location : {
            street : req.body.street,
            city : req.body.city,
            state : req.body.state,
            zip : req.body.zip,
            meta : {
                //lat and lng from google geocode API
                lat : coordinates.lat,
                lng : coordinates.lng
            }
        }
    }

    //create new shop document, save to db, redirect to that shop's 
    //page
    Shop.create(newShop, function(error, newlyCreated){
        if(error){
            console.log(error);
            res.redirect('/shops')
        } else {
            //redirecct to newly created shop
            res.redirect(`/shops/${newlyCreated._id}`);
        }
    });
});



//NEW ROUTE - RENDER FORM TO REDIRECT TO CREATE ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("shops/new.ejs"); 
});

router.get('/search', function(req, res) {
    
    
    var query = new RegExp(`${req.query.searchParam}`, `i`);
    console.log(query)
    Shop.find({
        'location.city' :  query
    }, function (err, doc) {
       if (err) {
           console.log('error');
           res.redirect('/');
       } else {
        console.log(doc)   
        res.render('shops/search.ejs', {
               searchResults : doc,
               query : req.query.searchParam
           })
       } 

    })
    
})

// SHOW ROUTE - SHOW SELECTED SHOP
router.get("/:id", function(req, res){
    //find the shop with provided ID - IMPORTANT: MUST POPULATE COMMENT ARRAY
    Shop.findOne({"_id": req.params.id}).populate("comments").exec(function(err, queriedShop){
        if(err){
            console.log(err);
            res.redirect('/shops');
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
        if (err) {
            res.redirect('/shops')
        }
        res.render("shops/edit.ejs", {shop: queriedShop});
    });
});


router.get("/:id/edit/updateAddress", middleware.checkShopOwnership, function(req, res) {
    Shop.findOne({"_id" : req.params.id}, function(err, queriedShop) {
        if (err) {
            res.redirect('/shops')
        }
        res.render("shops/updateAddress.ejs", {shop: queriedShop});
    });
});



// UPDATE ROUTE (REQUIRES METHOD-OVERRIDE) - PUT REQUEST TO UPDATE SHOP DB ENTRY
router.put("/:id",middleware.checkShopOwnership, function(req, res){
    // find and update the correct shop
    Shop.findOneAndUpdate({"_id": req.params.id}, req.body.shop, function(err, updatedCampground){
       if(err){
           res.redirect("/shops");
       } else {
           
            //redirect somewhere(show page)
           res.redirect("/shops/" + req.params.id);
       }
    });
});

router.put("/:id/updateAddress", middleware.checkShopOwnership, getCoordinates, function(req, res){
    let coordinates = res.locals.googleApiResponse.results[0].geometry.location;
    Shop.findOneAndUpdate({"_id" : req.params.id}, {
        location : {
            street : req.body.street,
            city : req.body.city,
            state : req.body.state,
            zip : req.body.zip,
            meta : {
                lat : coordinates.lat,
                lng : coordinates.lng
            }
        }
    }, function(err, updatedShop) {
        if (err) {
            res.redirect('/shops')
        } else {
            res.redirect(`/shops/${req.params.id}`);
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

