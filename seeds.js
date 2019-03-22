var mongoose = require("mongoose");
var Shop = require("./models/shop");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Backyard Beans",
        location: {
            street: "408 W Main St",
            city: "Lansdale",
            state: "PA",
            zip: 19446,
            meta: {
                lat: 40.243,
                lng: -75.287
            }
        },
        image: "/photos/backyard-beans.jpeg",
        rating: 5,
        description: "Backyard Beans Coffee Company is a local coffee company and shop that offers a variety of responsibly sourced coffees. Their beans are roasted on site making for the freshest of coffee experiences. If you're looking for a new regular coffee shop to go to, look no further than Backyard Beans in Lansdale, Pennsylvania!",
        menu: "https://www.backyardbeans.com/cafe"
    }
]



var dataOld = [
    {
        name: "Backyard Beans", 
        image: "https://static1.squarespace.com/static/5341526de4b089b274aedd6e/5a80b3ba0d92973fecf2ed21/5a80b3baec212d81180c0816/1518384063605/Backyard+Beans+Grand+Opening+%282+of+12%29.jpg?format=1000w",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Old City Coffee", 
        image: "https://oldcitycoffee.com/wp-content/uploads/2016/09/old-city-coffee-1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "The Coffee Shop", 
        image: "https://images.unsplash.com/photo-1511081692775-05d0f180a065?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB(){
   //Remove all campgrounds
   Shop.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed shops");
         //add shops
        data.forEach(function(seed){
            Shop.create(seed, function(err, newShop){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a shop");
                    //create a comment
                    Comment.create(
                        {
                            text: "What a great place to drink coffe",
                            author: "Tyler"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                newShop.comments.push(comment);
                                newShop.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
