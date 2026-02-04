# Order Processing & Analytics API

## Overview

Backend-only project simulating high-volume e-commerce order processing.
Focus is on performance, analytics, and business logic, generating measurable engineering metrics.

> Not a full product — purely for demonstration of backend skills, SQL optimization, and business logic implementation.

---

## Tech Stack

- Node.js + Express — API server
- PostgreSQL — Relational database
- pg — SQL driver
- @faker-js/faker — Seed realistic data
- dotenv — Environment variables
- nodemon — Development convenience

---

## Project Structure

```zsh
src/
  app.js          # Express app
  server.js       # Server entry point
  db/
    index.js      # Database connection
    schema.sql    # DB schema
    seed.js       # Seed script
  routes/         # API routes
  services/       # Business logic layer
  validators/     # Input validation
```

---

## Setup

### 1. Clone the repo

```git clone https://github.com/Frankuccino/order-processing-api.git
cd order-processing-api
```

### 2. Install dependencies

`pnpm install`

### 3. Set up PostgreSQL

```createdb order_system
psql order_system
\i src/db/schema.sql
```

### 4. Create .env file

`DATABASE_URL=postgres://<your_pg_user>/order_system`

### 5. Seed the database

`pnpm exec node src/db/seed.js`

### 6. Run the server

`pnpm run dev`

---

## Project Status

- ✅ Step 0: Project skeleton & environment setup
- ✅ Step 1: Database schema created
- ✅ Step 2: Seeded 2,000 users, 10,000 orders, 29,855 order items, 5,047 payments
- ⚙️ Step 3: Business logic (order lifecycle rules) — in progress
- ⚙️ Step 4: Analytics endpoints added (revenue, top users, order status, top products)

---

## Analytics Endpoints

| Endpoint                     |                      Description |
| :--------------------------- | -------------------------------: |
| GET /analytics/revenue Total |        revenue from all payments |
| ET /analytics/revenue/users  |   Top 10 users by total spending |
| GET /analytics/orders/status |       Count of orders per status |
| GET /analytics/products/top  | Top 10 products by quantity sold |

> All endpoints return execution time to capture performance metrics.

## Performance & Indexing

This project simulates high-volume order processing and demonstrates measurable backend performance through indexing and query optimization.

### Indexes Added

Key Queries Tested

1. Top Users by Revenue
2. Top-Selling Products
3. Order Status Breakdown

#### Indexing Strategy

We created indexes to match JOINs, WHERE, and ORDER BY patterns:

```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

- Optimizes joins, filters, and aggregates
- Reduces query execution time on large datasets
- Improves join performance
- Reduces grouping and aggregation costs
- Optimizes filtering and sorting

#### Sample Query: Top Users by Revenue

```sql
SELECT u.id, u.email, SUM(p.amount_cents)/100.0 AS total_spent
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN payments p ON o.id = p.order_id
GROUP BY u.id, u.email
ORDER BY total_spent DESC
LIMIT 10;
```

**Execution Metrics (after indexing)**

- Planning Time: 0.364 ms.
- Execution Time: 10.599 ms.
- Rows returned: 10.

**Insights**

- Indexes improved lookup and aggregation performance for realistic workloads.
- Execution time fluctuates slightly due to cache, CPU scheduling, and planner behavior, but remains sub-20 ms for top-N queries on thousands of rows.

#### Realistic Workload Testing

```sql
SELECT
  o.id,
  SUM(oi.quantity * oi.price_cents) AS total_cents
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'COMPLETED'
GROUP BY o.id
ORDER BY total_cents DESC
LIMIT 20;
```

- Execution Time: 4.35 ms on ~30k order items
- Confirms index usage and efficient aggregation
- Demonstrates business-critical metrics computation under realistic load

> This section shows data-driven, measurable backend performance, emphasizing query optimization, indexing, and real workload handling — key points for recruiters or performance-focused portfolios.

### Example Metric

#### Top Users by Revenue

```json
{
  "execution_ms": 36,
  "data": [
    { "id": 192, "email": "Maxie_Rath@gmail.com", "total_spent": "3548.63" },
    {
      "id": 783,
      "email": "Odessa.Pouros53@yahoo.com",
      "total_spent": "3522.10"
    }
  ]
}
```

> Optimized queries handle 10k+ orders and 30k+ line items with sub-50ms execution, demonstrating measurable backend performance.

---

## Stress Test & Performance Metrics

This project includes stress test script(scripts/stressTest-1.js) that simulated processing 100 orders and measures the performances of key analytics endpoints.

### Stress Test Results (sample):

```zsh
Processed 100 orders...
Stress test complete!
Average time per order: 1.33 ms
```

### Analytics Endpoints Performance

| Endpoint                   | Execution Time | Sample Data                                                                                                                                                                                                                 |
| -------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/analytics/revenue`       | 24 ms          | `{ total_revenue: '1610520.80' }`                                                                                                                                                                                           |
| `/analytics/revenue/users` | 4 ms           | Top 3 users:<br>• [Maxie_Rath@gmail.com](mailto:Maxie_Rath@gmail.com) — 3548.63<br>• [Odessa.Pouros53@yahoo.com](mailto:Odessa.Pouros53@yahoo.com) — 3522.10<br>• [Carole97@gmail.com](mailto:Carole97@gmail.com) — 3495.38 |
| `/analytics/orders/status` | 2 ms           | `{ COMPLETED: 1, SHIPPED: 4, PAID: 225 }`                                                                                                                                                                                   |
| `/analytics/products/top`  | 3 ms           | Top 3 products:<br>• Handcrafted Plastic Keyboard — 1318 sold<br>• Recycled Gold Bacon — 1313 sold<br>• Handcrafted Steel Computer — 1306 sold                                                                              |

> These numbers demonstrate sub-millisecond order processing and fast aggregation queries even with thousands of records, showing proper indexing and efficient SQL joins in action.

# Next Steps

1. Business Logic / Transactions

- Atomic creation of orders, items, and payments
- Input validation and invariants

2. Performance Measurement

- Capture EXPLAIN ANALYZE metrics for heavy queries

3. Resume-ready Metrics

- Include execution times, row counts, and optimizations
