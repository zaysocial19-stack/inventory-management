# Architecture

## Production Architecture

```text
                         USERS
                           |
                           v
                    inventory.example.com
                           |
                           v
                       Cloudflare
                           |
                           v
                         HTTPS
                           |
                           v
                    Hetzner VPS / Ubuntu
                           |
                           v
                         Nginx
                           |
                +----------+----------+
                |                     |
                v                     v
        React Frontend          NestJS Backend
        TypeScript/Vite         TypeScript
                                      |
                                      v
                                    Prisma
                                      |
                                      v
                                  PostgreSQL
```

## Container Architecture

```text
Ubuntu VPS
|
+-- Nginx
|
+-- Docker
    |
    +-- frontend container
    |
    +-- backend container
    |
    +-- postgres container
```

## Responsibilities

### React

Responsible for:

- User interface
- Client-side routing
- User interaction
- Displaying API data
- Form handling
- Client-side state and server-state management

React does not directly access PostgreSQL.

### NestJS

Responsible for:

- HTTP API
- Authentication
- Authorization
- Input validation
- Business logic
- Database access through Prisma
- Error handling

### Prisma

Responsible for:

- Database access from NestJS
- Type-safe queries
- Schema/migration workflow

### PostgreSQL

Responsible for:

- Persistent application data
- Relationships
- Constraints
- Transactions
- Indexes

### Nginx

Responsible for:

- Receiving public HTTP/HTTPS traffic
- Serving/routing frontend traffic
- Reverse proxying API requests to NestJS
- TLS configuration

### Docker

Responsible for:

- Packaging applications
- Running consistent environments
- Isolating application services
- Service networking

### Cloudflare

Responsible for:

- DNS
- Public domain routing
- Network/proxy layer as configured

### GitHub Actions

Responsible for:

- Automated checks
- Tests
- Builds
- Deployment workflow

## Request Flow: Page Load

```text
Browser
  |
  v
Cloudflare
  |
  v
VPS
  |
  v
Nginx
  |
  v
React
  |
  v
Browser renders application
```

## Request Flow: API

```text
Browser
  |
  | GET /api/products
  v
Cloudflare
  |
  v
Nginx
  |
  v
NestJS
  |
  v
Authentication / Authorization
  |
  v
Business Logic
  |
  v
Prisma
  |
  v
PostgreSQL
  |
  v
NestJS
  |
  v
JSON response
  |
  v
React
```

## Request Flow: Create Order

```text
React
  |
  | POST /api/orders
  v
Nginx
  |
  v
NestJS
  |
  +--> Validate request
  |
  +--> Authenticate user
  |
  +--> Check authorization
  |
  +--> Create order
  |
  +--> Create order items
  |
  +--> Update inventory
  |
  +--> Create stock movement
  |
  v
Prisma transaction
  |
  v
PostgreSQL
```

All related database changes should succeed together or roll back together when transaction requirements demand it.
