// scripts/stressTest.js
const axios = require("axios");
const { query } = require("../src/db");

const BASE_URL = "http://localhost:3000"; // Adjust if your server port is different
const ORDERS_TO_PROCESS = 100; // Number of random orders for the stress test

async function getRandomOrder() {
  const res = await query("SELECT id FROM orders ORDER BY RANDOM() LIMIT 1");
  return res.rows[0].id;
}

async function processOrder(orderId) {
  const orderRes = await query("SELECT * FROM orders WHERE id=$1", [orderId]);
  const order = orderRes.rows[0];
  if (!order) throw new Error("Order not found");

  // Only pay CREATED orders
  if (order.status === "CREATED") {
    // Check if payment exists
    const paymentRes = await query(
      "SELECT id FROM payments WHERE order_id=$1",
      [order.id],
    );

    if (paymentRes.rows.length === 0) {
      await query(
        "INSERT INTO payments (order_id, amount_cents) VALUES ($1,$2)",
        [order.id, order.total_cents],
      );
      await query("UPDATE orders SET status='PAID' WHERE id=$1", [order.id]);
    }
  }

  // Ship PAID orders
  if (order.status === "PAID") {
    await query("UPDATE orders SET status='SHIPPED' WHERE id=$1", [order.id]);
  }

  // Complete SHIPPED orders
  if (order.status === "SHIPPED") {
    await query("UPDATE orders SET status='COMPLETED' WHERE id=$1", [order.id]);
  }

  return true;
}

async function testAnalyticsEndpoints() {
  const endpoints = [
    "/analytics/revenue",
    "/analytics/revenue/users",
    "/analytics/orders/status",
    "/analytics/products/top",
  ];

  for (const endpoint of endpoints) {
    const start = Date.now();
    const res = await axios.get(`http://localhost:3000${endpoint}`);
    const execution_ms = Date.now() - start;

    // Determine sample data safely
    let sample;
    if (Array.isArray(res.data)) {
      sample = res.data.slice(0, 3);
    } else if (res.data.data && Array.isArray(res.data.data)) {
      sample = res.data.data.slice(0, 3);
    } else {
      sample = res.data;
    }

    console.log(`Endpoint ${endpoint} executed in ${execution_ms} ms`);
    console.log("Sample data:", sample);
  }
}

async function main() {
  console.log(
    `Starting stress test: processing ${ORDERS_TO_PROCESS} orders...`,
  );
  const startTotal = Date.now();

  for (let i = 1; i <= ORDERS_TO_PROCESS; i++) {
    const orderId = await getRandomOrder();
    try {
      const start = Date.now();
      await processOrder(orderId);
      const end = Date.now();
      if (i % 10 === 0) console.log(`Processed ${i} orders...`);
    } catch (err) {
      console.error("Error processing order:", err.message);
    }
  }

  const endTotal = Date.now();
  console.log("Stress test complete!");
  console.log(
    `Average time per order: ${(
      (endTotal - startTotal) /
      ORDERS_TO_PROCESS
    ).toFixed(2)} ms`,
  );

  // Test analytics endpoints
  await testAnalyticsEndpoints();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
