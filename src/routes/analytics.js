const express = require("express");
const router = express.Router();
const { query } = require("../db");
const { timeExecution } = require("../utils/timer");

router.get(
  "/revenue",
  timeExecution(async (req, res) => {
    const start = Date.now();
    const result = await query(
      "SELECT SUM(amount_cents)/100.0 AS total_revenue FROM payments",
    );
    const duration = Date.now() - start;
    res.json({ execution_ms: duration, data: result.rows[0] });
  }),
);

router.get(
  "/revenue/users",
  timeExecution(async (req, res) => {
    const start = Date.now();
    const result = await query(`
    SELECT u.id, u.email, SUM(p.amount_cents)/100.0 AS total_spent
    FROM users u
    JOIN orders o ON u.id = o.user_id
    JOIN payments p ON o.id = p.order_id
    GROUP BY u.id, u.email
    ORDER BY total_spent DESC
    LIMIT 10
  `);
    const duration = Date.now() - start;
    console.log(`[Analytics] /revenue/users executed in ${duration}ms`);
    res.json({ execution_ms: duration, data: result.rows });
  }),
);

router.get(
  "/orders/status",
  timeExecution(async (req, res) => {
    const result = await query(
      "SELECT status, COUNT(*) AS count FROM orders GROUP BY status",
    );
    res.json(result.rows);
  }),
);

router.get(
  "/products/top",
  timeExecution(async (req, res) => {
    const result = await query(`
    SELECT p.id, p.name, SUM(oi.quantity) AS total_sold
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    GROUP BY p.id, p.name
    ORDER BY total_sold DESC
    LIMIT 10
  `);
    res.json(result.rows);
  }),
);

module.exports = router;
