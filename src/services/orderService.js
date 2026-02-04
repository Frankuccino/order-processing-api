const { query } = require("../db");

class OrderService {
  // Create a new order for a user
  static async createOrder(userId, items = []) {
    // Start with CREATED status
    const res = await query(
      "INSERT INTO orders (user_id, status, total_cents) VALUES ($1, $2, $3) RETURNING *",
      [userId, "CREATED", 0],
    );
    const order = res.rows[0];

    let total = 0;

    // Add items
    for (const item of items) {
      const priceRes = await query(
        "SELECT price_cents FROM products WHERE id=$1",
        [item.productId],
      );
      const price = priceRes.rows[0].price_cents;

      await query(
        "INSERT INTO order_items (order_id, product_id, quantity, price_cents) VALUES ($1,$2,$3,$4)",
        [order.id, item.productId, item.quantity, price],
      );

      total += price * item.quantity;
    }

    // Update total
    await query("UPDATE orders SET total_cents=$1 WHERE id=$2", [
      total,
      order.id,
    ]);

    return { ...order, total_cents: total };
  }

  // Pay for an order
  static async payOrder(orderId, amount) {
    // Fetch order
    const res = await query("SELECT * FROM orders WHERE id=$1", [orderId]);
    if (!res.rows[0]) throw new Error("Order not found");
    const order = res.rows[0];

    if (order.status !== "CREATED")
      throw new Error("Only CREATED orders can be paid");

    // Validate amount
    if (amount !== order.total_cents)
      throw new Error("Payment amount does not match order total");

    // Add payment
    await query(
      "INSERT INTO payments (order_id, amount_cents) VALUES ($1,$2)",
      [orderId, amount],
    );

    // Update order status
    await query("UPDATE orders SET status=$1 WHERE id=$2", ["PAID", orderId]);

    return true;
  }

  // Ship an order
  static async shipOrder(orderId) {
    const res = await query("SELECT * FROM orders WHERE id=$1", [orderId]);
    const order = res.rows[0];
    if (!order) throw new Error("Order not found");

    if (order.status !== "PAID")
      throw new Error("Only PAID orders can be shipped");

    await query("UPDATE orders SET status=$1 WHERE id=$2", [
      "SHIPPED",
      orderId,
    ]);
    return true;
  }

  // Complete an order
  static async completeOrder(orderId) {
    const res = await query("SELECT * FROM orders WHERE id=$1", [orderId]);
    const order = res.rows[0];
    if (!order) throw new Error("Order not found");

    if (order.status !== "SHIPPED")
      throw new Error("Only SHIPPED orders can be completed");

    await query("UPDATE orders SET status=$1 WHERE id=$2", [
      "COMPLETED",
      orderId,
    ]);
    return true;
  }
}

module.exports = OrderService;
