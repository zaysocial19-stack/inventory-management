# Database Design

## Database

PostgreSQL

## ORM

Prisma

## Initial Entities

```text
User
 |
 +-- Role

Product
 |
 +-- Category
 |
 +-- Supplier

Inventory
 |
 +-- Product
 |
 +-- StockMovement

Order
 |
 +-- OrderItem
       |
       +-- Product
```

## Core Entities

### User

Stores application users.

Expected concepts:

- ID
- name
- email
- password hash
- role
- timestamps

### Role

Defines authorization level.

Roles:

- Admin
- Manager
- Staff

### Product

Stores sellable/inventory products.

Expected concepts:

- ID
- SKU
- name
- description
- price
- category
- supplier
- minimum stock threshold
- timestamps

### Category

Groups products.

### Supplier

Stores supplier information.

### Inventory

Stores current stock information for products.

### StockMovement

Records changes to stock.

Examples:

- received
- sold
- adjustment
- damaged
- returned

### Order

Represents a customer/business order.

### OrderItem

Represents individual products in an order.

## Relationships

The final ER diagram should document:

- User -> Role
- Product -> Category
- Product -> Supplier
- Product -> Inventory
- Product -> StockMovement
- Order -> OrderItem
- OrderItem -> Product
- User -> Orders where applicable

## Database Principles

- Use primary keys.
- Use foreign keys.
- Use appropriate constraints.
- Use indexes where justified.
- Avoid duplicated data.
- Use transactions for multi-step business operations.
- Never store plaintext passwords.
- Keep production credentials outside the repository.

## Migration Principle

Database schema changes must be represented through migrations.

Do not manually modify production schema without documenting the change.
