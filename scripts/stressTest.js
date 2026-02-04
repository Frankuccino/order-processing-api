const axios = require("axios");

const API_BASE = "http://localhost:3000";

const USERS_COUNT = 2000; // match your seed
const PRODUCTS_COUNT = 50;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pick random products for an order
function generateOrderItems() {
  const count = randomInt(1, 5);
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      productId: randomInt(1, PRODUCTS_COUNT),
      quantity: randomInt(1, 3),
    });
  }
  return items;
}

async function processOrder(userId) {
  try {
    // Create order
    const orderRes = await axios.post(`${API_BASE}/orders`, {
      userId,
      items: generateOrderItems(),
    });
    const order = orderRes.data;

    // Pay for order if total > 0
    if (order.total_cents > 0) {
      await axios.post(`${API_BASE}/orders/${order.id}/pay`, {
        amount: order.total_cents,
      });
    }

    return { success: true };
  } catch (err) {
    console.warn("Error processing order:", {
      success: false,
      message: err.response?.data?.message || err.message || "Unknown error",
    });
    return { success: false };
  }
}

async function hitAnalytics(endpoint) {
  try {
    const res = await axios.get(`${API_BASE}${endpoint}`);
    const output = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data.data)
        ? res.data.data
        : [res.data];
    console.log(
      `Endpoint ${endpoint} executed in ${res.headers["x-response-time"] || "N/A"} ms`,
    );
    console.log("Sample data:", output.slice(0, 3));
  } catch (err) {
    console.warn(`Error hitting analytics ${endpoint}:`, err.message);
  }
}

async function main() {
  const start = Date.now();
  const ordersToProcess = 100;

  for (let i = 0; i < ordersToProcess; i++) {
    const userId = randomInt(1, USERS_COUNT);
    await processOrder(userId);
    if ((i + 1) % 10 === 0) console.log(`Processed ${i + 1} orders...`);
  }

  const duration = (Date.now() - start) / ordersToProcess;
  console.log("Stress test complete!");
  console.log(`Average time per order: ${duration.toFixed(2)} ms`);

  // Hit analytics endpoints
  await hitAnalytics("/analytics/revenue");
  await hitAnalytics("/analytics/revenue/users");
  await hitAnalytics("/analytics/orders/status");
  await hitAnalytics("/analytics/products/top");
}

main();
