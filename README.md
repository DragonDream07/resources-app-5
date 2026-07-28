# E-commerce Backend API

A RESTful e-commerce API built with **Express**, **Knex**, and **PostgreSQL**, with full-text search powered by **Elasticsearch**.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Environment Variables](#environment-variables)
4. [Migration Commands](#migration-commands)
5. [Seed Commands](#seed-commands)
6. [Running the Server](#running-the-server)
7. [Testing](#testing)
8. [Module Dependency Direction (ADR)](#module-dependency-direction-adr)

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 18 |
| npm | >= 9 |
| PostgreSQL | >= 14 |
| Elasticsearch | >= 8 |
| Docker (optional) | >= 24 |

---

## Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd ecommerce-backend

# 2. Install dependencies
npm install

# 3. Copy the environment template and fill in your values
cp .env.example .env

# 4. Start infrastructure via Docker Compose (optional)
docker-compose up -d

# 5. Run database migrations
npm run migrate

# 6. (Optional) Seed the database with sample data
npm run seed

# 7. Start the development server
npm run dev
```

---

## Environment Variables

All variables are documented in [`.env.example`](.env.example). Copy it to `.env` and set real values before running.

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | yes | `development` | Runtime environment (`development`, `test`, `production`) |
| `PORT` | yes | `3000` | HTTP server port |
| `DB_HOST` | yes | `localhost` | PostgreSQL hostname |
| `DB_PORT` | no | `5432` | PostgreSQL port |
| `DB_NAME` | yes | `ecommerce_dev` | Database name |
| `DB_USER` | yes | `postgres` | Database user |
| `DB_PASSWORD` | yes | `postgres` | Database password |
| `TEST_DB_HOST` | test | `localhost` | Test DB hostname |
| `TEST_DB_PORT` | test | `5432` | Test DB port |
| `TEST_DB_NAME` | test | `ecommerce_test` | Test database name |
| `TEST_DB_USER` | test | `postgres` | Test DB user |
| `TEST_DB_PASSWORD` | test | `postgres` | Test DB password |
| `JWT_SECRET` | yes | — | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | no | `7d` | JWT expiry duration |
| `BCRYPT_ROUNDS` | no | `12` | bcrypt salt rounds |
| `ELASTICSEARCH_URL` | yes | `http://localhost:9200` | Elasticsearch cluster URL |
| `ELASTICSEARCH_INDEX` | no | `products` | Elasticsearch products index |
| `RATE_LIMIT_WINDOW_MS` | no | `900000` | Rate-limit window in ms |
| `RATE_LIMIT_MAX` | no | `100` | Max requests per window |
| `LOG_LEVEL` | no | `info` | Winston log level |
| `LOG_DIR` | no | `logs` | Directory for log files |
| `CORS_ORIGINS` | no | `http://localhost:5173` | Allowed CORS origins (comma-separated) |

---

## Migration Commands

```bash
# Run all pending migrations
npm run migrate
# or: npx knex migrate:latest

# Rollback the last batch of migrations
npm run migrate:rollback
# or: npx knex migrate:rollback

# Rollback all migrations
npx knex migrate:rollback --all

# Create a new migration file
npm run migrate:make -- <migration_name>
# or: npx knex migrate:make <migration_name>

# Full reset (rollback all → migrate → seed)
npm run db:reset
```

---

## Seed Commands

```bash
# Run all seed files in order
npm run seed
# or: npx knex seed:run

# Run a specific seed file
npx knex seed:run --specific=01_roles.js
```

Seed order:
1. `01_roles.js` — system roles (admin, customer, guest)
2. `02_admin_user.js` — default admin account
3. `03_categories.js` — product categories
4. `04_brands.js` — brands
5. `05_products_skus.js` — sample products and SKUs
6. `06_promo_codes.js` — promotional codes

---

## Running the Server

```bash
# Development (auto-restart on file change)
npm run dev

# Production
npm start
```

---

## Testing

```bash
# Run all tests
npm test

# With coverage report
npm run test:coverage
```

Tests use a separate PostgreSQL database (`TEST_DB_NAME`). Migrations are applied automatically before the test suite via `jest.setup.cjs`.

---

## Module Dependency Direction (ADR)

### Decision

All source code follows a strict **unidirectional dependency rule** to prevent circular imports and maintain clear separation of concerns.

### Dependency Layers (outermost → innermost)

```
HTTP Layer      routes  (*.routes.js)
                  |
Controller      *.controller.js
                  |
Service         *.service.js
                  |
Repository      src/db/repositories/*.repository.js
                  |
DB Client       src/db/client.js
                  |
Infrastructure  PostgreSQL / Elasticsearch
```

### Rules

- Each layer may only import from layers **below** it.
- **Routes** import controllers and middleware only.
- **Controllers** import services only (never repositories directly).
- **Services** import repositories, utilities, and config.
- **Repositories** import `db/client` and config only — never modules or services.
- **Middleware** and **utils** are leaf nodes — they must not import from any feature module.
- **Config** (`src/config/`) is infrastructure-level — no module imports allowed.

### Rationale

- Eliminates circular dependency bugs at compile/lint time (`import/no-cycle` ESLint rule enforces this).
- Makes each layer independently testable via dependency injection or mocking.
- Provides a clear mental model for where to add new logic.
- Follows the Ports & Adapters (Hexagonal) architecture pattern used by the payment and search adapters.

### Enforcement

The `.eslintrc.js` configuration uses `eslint-plugin-import` rules:
- `import/no-cycle` — hard error on any circular dependency.
- `import/no-restricted-paths` — hard error when a lower layer imports from a higher layer.
