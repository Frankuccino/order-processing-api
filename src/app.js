const express = require("express");
const app = express();

app.use(express.json());

// Import routes
const orderRoutes = require("./routes/orders");

// Mount routes
app.use("/orders", orderRoutes);

module.exports = app;
