var Shop = require("../models/shop.js");
var shopImages = [];

Shop.find({}, function(err, queriedShops){
	if (err) {
		console.log(err);
	} else {
		queriedShops.forEach(function(shop){
			shopImages.push(shop.image);
		});
	}
});

console.log(shopImages);