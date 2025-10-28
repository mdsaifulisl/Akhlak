const express = require("express");
const cors = require("cors");
const productRoute = require("./router/productRoute");
const orderRouter = require("./router/orderRouter");
const axios = require("axios");
const cron = require("node-cron");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("uploads"));

app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use("/api/products", productRoute);
app.use("/api/orders", orderRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
}); 


// প্রতি 14 মিনিট পর সার্ভার নিজেকে ping করবে
cron.schedule("*/14 * * * *", async () => {
  try {
    await axios.get("https://akhlak.backend.reliablekrishi.com/");
    console.log("✅ Server pinged to stay awake");
  } catch (err) {
    console.error("⚠️ Ping failed:", err.message);
  }
}); 
 

const port = 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
 