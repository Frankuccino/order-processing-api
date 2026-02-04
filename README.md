# Order Processing & Analytics API

## Overview

This is a backend-only project designed to simulate **high-volume order processing** for an e-commerce system.  
The goal is to **generate measurable engineering metrics** while practicing SQL, business logic, and backend performance optimizations.

> Not a full product — purely for **performance, analytics, and business logic demonstration**.

---

## Tech Stack

- **Node.js + Express** — API server
- **PostgreSQL** — Relational database
- **pg** — Raw SQL driver
- **@faker-js/faker** — Seed realistic data
- **dotenv** — Environment management
- **nodemon** — Development convenience

---

## Project Structure

```
src/.
app.js # Express app.
server.js # Server entry point.
  db/
  index.js # Database connection
  schema.sql # Database schema
  seed.js # Seed script
routes/ # API routes
services/ # Business logic layer
validators/ # Input validation
```

---

## Setup

### 1. **Clone the repo**

```bash
git clone <your-repo-url>
cd order-processing-api
```

### 2. **Install dependencies**

```
pnpm install
```

### 3. Set up PostgreSQL database

```
createdb order_system
psql order_system
\i src/db/schema.sql
```

### 4. Create `.env` file in the root:

```
DATABASE_URL=postgres://<your_pg_user>/order_system
```

### 5. Seed database

```
pnpm exec node src/db/seed.js
```

### 6. Run Server

```
pnpm run dev
```

---

# Project Status

✅ Step 0: Project skeleton & environment setup  
✅ Step 1: Database schema created.  
✅ Step 2: Seeded 2,000 users, 10,000 orders, 29,855 order items, 5,047 payments.  
⚙️ Step 3: Business logic (order lifecycle rules) — in progress.

# Next Steps

Implement services/orderService.js with lifecycle rules

Add analytics endpoints for revenue, top users

Add performance measurements using EXPLAIN ANALYZE and load testing
