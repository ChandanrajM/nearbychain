const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({

  shopId:String,
  service:String,
  price:Number,
  status:String,
  txHash:String

});

module.exports = mongoose.model("Order",OrderSchema);