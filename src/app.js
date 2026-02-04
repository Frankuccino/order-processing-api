const express = require("express");
const app = express();

app.use(express.json());

// Import routes
const orderRoutes = require("./routes/orders");
const analyticsRoutes = require("./routes/analytics");

// Mount routes
app.use("/orders", orderRoutes);
app.use("/analytics", analyticsRoutes);

module.exports = app;
