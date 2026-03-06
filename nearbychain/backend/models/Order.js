const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({

shopId:String,

service:String,

pages:Number,

price:Number,

status:String,

txHash:String,

createdAt:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("Order",OrderSchema);