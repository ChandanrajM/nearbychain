const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const shopRoutes = require("./routes/shopRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", shopRoutes);
app.use("/api", orderRoutes);

connectDB();

app.get("/", (req,res)=>{
res.send("NearbyChain API running");
});

app.listen(5000,()=>{
console.log("Server running on port 5000");
});