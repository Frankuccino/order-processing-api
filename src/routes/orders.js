const express = require("express");
const router = express.Router();
const OrderService = require("../services/orderService");

// routes
// POST /orders               auto-calculate total
// POST /orders/:id/pay       onle CREATED orders can be paid
// POST /orders/:id/ship      only PAID orders can be shipped
// POST /orders/:id/complete. only SHIPPED orders can complete

// Middleware placeholder: add auth later
const isLoggedIn = (req, res, next) => next();

// Create a new order
router.post("/", isLoggedIn, async (req, res) => {
  try {
    // Expect body: { userId: 1, items: [{productId: 1, quantity: 2}, ...] }
    const { userId, items } = req.body;
    const order = await OrderService.createOrder(userId, items || []);
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Pay for an order
router.post("/:id/pay", isLoggedIn, async (req, res) => {
  try {
    const { amount } = req.body;
    await OrderService.payOrder(parseInt(req.params.id), amount);
    res.json({ success: true, message: "Order paid successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Ship an order
router.post("/:id/ship", isLoggedIn, async (req, res) => {
  try {
    await OrderService.shipOrder(parseInt(req.params.id));
    res.json({ success: true, message: "Order shipped successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Complete an order
router.post("/:id/complete", isLoggedIn, async (req, res) => {
  try {
    await OrderService.completeOrder(parseInt(req.params.id));
    res.json({ success: true, message: "Order completed successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
