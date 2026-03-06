const express = require("express");
const router = express.Router();

const Shop = require("../models/Shop");

router.post("/add-shop", async (req,res)=>{

const shop = new Shop(req.body);

await shop.save();

res.json(shop);

});

router.get("/shops", async (req,res)=>{

const shops = await Shop.find();

res.json(shops);

});

module.exports = router;