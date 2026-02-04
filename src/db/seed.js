const { query } = require("./index");
const { faker } = require("@faker-js/faker");

async function seed() {
  try {
    console.log("Seeding database...");

    // ---- USERS ----
    const usersCount = 1000; // You can increase to 10k or more later
    for (let i = 0; i < usersCount; i++) {
      await query("INSERT INTO users (email, role) VALUES ($1, $2)", [
        faker.internet.email(),
        "user",
      ]);
    }

    // ---- PRODUCTS ----
    const productsCount = 50;
    for (let i = 0; i < productsCount; i++) {
      await query("INSERT INTO products (name, price_cents) VALUES ($1, $2)", [
        faker.commerce.productName(),
        faker.number.int({ min: 100, max: 10000 }),
      ]);
    }

    // ---- ORDERS & ORDER ITEMS ----
    const ordersPerUser = 10;
    for (let userId = 1; userId <= usersCount; userId++) {
      for (let o = 0; o < ordersPerUser; o++) {
        const status = "CREATED";
        const total_cents = 0; // will calculate later
        const res = await query(
          "INSERT INTO orders (user_id, status, total_cents) VALUES ($1, $2, $3) RETURNING id",
          [userId, status, total_cents],
        );
        const orderId = res.rows[0].id;

        // Random items
        const itemsCount = faker.number.int({ min: 1, max: 5 });
        let orderTotal = 0;
        for (let j = 0; j < itemsCount; j++) {
          const productId = faker.number.int({ min: 1, max: productsCount });
          const quantity = faker.number.int({ min: 1, max: 3 });
          const priceRes = await query(
            "SELECT price_cents FROM products WHERE id=$1",
            [productId],
          );
          const price = priceRes.rows[0].price_cents;

          await query(
            "INSERT INTO order_items (order_id, product_id, quantity, price_cents) VALUES ($1, $2, $3, $4)",
            [orderId, productId, quantity, price],
          );

          orderTotal += price * quantity;
        }

        // Update order total
        await query("UPDATE orders SET total_cents=$1 WHERE id=$2", [
          orderTotal,
          orderId,
        ]);

        // Optionally add payment 50% of the time
        if (Math.random() < 0.5) {
          await query(
            "INSERT INTO payments (order_id, amount_cents) VALUES ($1, $2)",
            [orderId, orderTotal],
          );
        }
      }
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
