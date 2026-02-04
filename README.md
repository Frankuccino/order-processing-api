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

### Indexes Added

```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

- Optimizes joins, filters, and aggregates
- Reduces query execution time on large datasets

### Example Metric

#### Top Users by Revenue

```json
{
"execution_ms": 36,
"data": [
{ "id": 192, "email": "Maxie_Rath@gmail.com", "total_spent": "3548.63" },
{ "id": 783, "email": "Odessa.Pouros53@yahoo.com", "total_spent": "3522.10" },
...
]
}
```

> Optimized queries handle 10k+ orders and 30k+ line items with sub-50ms execution, demonstrating measurable backend performance.

# Next Steps

1. Business Logic / Transactions

- Atomic creation of orders, items, and payments
- Input validation and invariants

2. Performance Measurement

- Capture EXPLAIN ANALYZE metrics for heavy queries

3. Resume-ready Metrics

- Include execution times, row counts, and optimizations
