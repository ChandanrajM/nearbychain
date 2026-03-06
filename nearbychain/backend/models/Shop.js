const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({

name:String,

lat:Number,

lng:Number,

rating:Number,

wallet:String

});

module.exports = mongoose.model("Shop",ShopSchema);