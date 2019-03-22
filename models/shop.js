var mongoose = require("mongoose");

var shopSchema = new mongoose.Schema({
   name: String,
   location: {
      street: String,
      city: String,
      state: String,
      zip: Number,
      meta: {
         lat: Number,
         lng: Number
      }
   },
   image: String,
   phone: Number,
   rating: Number,
   description: String,
   menu: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   tags: [String],
   amenities: [String]
});

module.exports = mongoose.model("Shop", shopSchema);