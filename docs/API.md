# API Documentation

## API Base

Development:

```text
http://localhost:<backend-port>/api
```

Production:

```text
https://inventory.example.com/api
```

## Health

```text
GET /api/health
```

Purpose:

Verify that the backend is running.

## Authentication

Planned endpoints:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## Products

Planned endpoints:

```text
GET    /api/products
POST   /api/products
GET    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id
```

## Inventory

Planned endpoints:

```text
GET  /api/inventory
GET  /api/inventory/:productId
POST /api/inventory/:productId/receive
POST /api/inventory/:productId/adjust
GET  /api/inventory/:productId/movements
```

## Orders

Planned endpoints:

```text
GET  /api/orders
POST /api/orders
GET  /api/orders/:id
PATCH /api/orders/:id/status
```

## Users

Planned endpoints:

```text
GET   /api/users
GET   /api/users/:id
PATCH /api/users/:id
```

## API Design Rules

- Use appropriate HTTP methods.
- Return meaningful HTTP status codes.
- Validate request bodies.
- Validate path/query parameters.
- Use consistent error responses.
- Protect private endpoints.
- Enforce authorization in the backend.
- Use pagination for potentially large collections.

The API documentation must be updated as endpoints become real. Do not leave planned endpoints documented as implemented.
