# Project Roadmap

## Phase 0 — Architecture

- [x] Understand frontend vs backend
- [x] Understand HTTP and REST
- [x] Understand API request/response flow
- [x] Understand databases
- [x] Understand VPS
- [x] Understand Linux server
- [x] Understand Docker
- [x] Understand Nginx
- [x] Understand reverse proxy
- [x] Understand DNS
- [x] Understand HTTPS
- [x] Understand CI/CD
- [x] Draw the complete architecture

## Phase 1 — Development Environment

- [x] Verify Node.js (v24.15.0)
- [x] Verify npm (v11.12.1)
- [x] Verify Git (v2.53.0)
- [ ] Verify Docker (scheduled for Phase 5: PostgreSQL container)
- [ ] Verify PostgreSQL tooling (scheduled for Phase 5)
- [x] Configure IDE / workspace
- [x] Create project workspace

## Phase 2 — Git Repository

- [x] Initialize repository
- [x] Create `.gitignore`
- [x] Create README
- [x] Make initial commit
- [x] Create GitHub repository
- [x] Push repository
- [x] Establish meaningful commit convention

## Phase 3 — Frontend Foundation

- [x] Create React + TypeScript + Vite project
- [x] Understand project structure
- [x] Create initial components
- [x] Add React Router
- [x] Create page layout
- [x] Learn TypeScript types/interfaces
- [x] Create forms
- [x] Add Tailwind CSS
- [x] Build initial dashboard UI

## Phase 4 — Backend Foundation

- [x] Create NestJS project
- [x] Understand modules
- [x] Understand controllers
- [x] Understand services
- [x] Understand dependency injection
- [x] Create `/api/health`
- [x] Add validation
- [x] Configure API structure
- [x] Add Swagger/OpenAPI

## Phase 5 — PostgreSQL

- [x] Install/configure PostgreSQL for development
- [x] Learn relational database concepts
- [x] Design entities
- [x] Create ER diagram
- [x] Configure Prisma
- [x] Create initial schema
- [x] Run migrations
- [x] Seed development data

## Phase 6 — Connect Backend to Database

- [x] Connect NestJS to Prisma
- [x] Implement Products module
- [x] GET products
- [x] GET product by ID
- [x] POST product
- [x] PATCH product
- [x] DELETE product
- [x] Validation
- [x] Error handling
- [x] Database constraints

## Phase 7 — Authentication

- [x] User registration
- [x] Password hashing
- [x] Login
- [x] Authentication state
- [x] Protected endpoints
- [x] Logout
- [x] Secure credential handling

## Phase 8 — Authorization

- [x] Define Admin role
- [x] Define Manager role
- [x] Define Staff role
- [x] Implement RBAC
- [x] Protect backend operations
- [ ] Protect frontend routes/UI appropriately

## Phase 9 — Inventory

- [x] Inventory model
- [x] Stock quantity
- [x] Stock movement model
- [x] Stock receiving
- [x] Stock reduction
- [x] Stock history
- [x] Low-stock threshold
- [x] Transaction-safe inventory updates

## Phase 10 — Orders

- [x] Order model
- [x] Order item model
- [x] Create order
- [x] Calculate totals
- [x] Order status
- [x] Order history
- [x] Connect orders to inventory

## Phase 11 — Frontend/API Integration

- [x] Create API client
- [x] Connect authentication
- [x] Connect products
- [x] Connect inventory
- [x] Connect orders
- [x] TanStack Query
- [x] Loading states
- [x] Error states
- [x] Cache invalidation

## Phase 12 — Professional UI

- [ ] Login
- [x] Dashboard
- [x] Products
- [x] Inventory
- [x] Suppliers
- [ ] Orders
- [ ] Users
- [ ] Reports
- [ ] Responsive layout
- [x] Reusable components

## Phase 13 — Search / Filtering / Pagination

- [ ] Backend pagination
- [ ] Frontend pagination
- [ ] Search
- [ ] Filtering
- [ ] Sorting
- [ ] Query parameters

## Phase 14 — Testing

- [ ] Backend unit tests
- [ ] API/integration tests
- [ ] Frontend component tests
- [ ] Authentication tests
- [ ] Authorization tests
- [ ] Inventory business logic tests
- [ ] Order tests

## Phase 15 — Docker

- [ ] Frontend Dockerfile
- [ ] Backend Dockerfile
- [ ] PostgreSQL container
- [ ] Docker Compose
- [ ] Environment variables
- [ ] Volumes
- [ ] Container networking
- [ ] Production-oriented images

## Phase 16 — Linux VPS

- [ ] Create Hetzner VPS
- [ ] Configure Ubuntu
- [ ] Configure SSH keys
- [ ] Create deployment user
- [ ] Configure firewall
- [ ] Install Docker
- [ ] Understand ports
- [ ] Learn server logs
- [ ] Check CPU/RAM/disk

## Phase 17 — Nginx

- [ ] Install Nginx
- [ ] Understand web server vs reverse proxy
- [ ] Configure frontend routing
- [ ] Configure `/api/*` routing
- [ ] Configure ports
- [ ] Verify external access

## Phase 18 — Domain / Cloudflare

- [ ] Configure domain
- [ ] Configure DNS
- [ ] Create application subdomain
- [ ] Point DNS to VPS
- [ ] Verify DNS resolution
- [ ] Understand proxying

## Phase 19 — HTTPS

- [ ] Configure TLS certificate
- [ ] Configure HTTPS
- [ ] Redirect HTTP to HTTPS
- [ ] Verify certificate
- [ ] Understand certificate renewal

## Phase 20 — Production PostgreSQL

- [ ] Production environment variables
- [ ] Secure database credentials
- [ ] Persistent database storage
- [ ] Production migrations
- [ ] Database backup
- [ ] Database restore test

## Phase 21 — CI/CD

- [ ] GitHub Actions workflow
- [ ] Install dependencies
- [ ] Lint
- [ ] Type check
- [ ] Test
- [ ] Build
- [ ] Deploy to VPS
- [ ] Verify deployment
- [ ] Rollback procedure

## Phase 22 — Monitoring / Logging

- [ ] Application logs
- [ ] Nginx logs
- [ ] Docker logs
- [ ] Resource monitoring
- [ ] Disk monitoring
- [ ] Basic uptime monitoring
- [ ] Error investigation procedure

## Phase 23 — Backups

- [ ] Automated PostgreSQL backup
- [ ] Backup retention
- [ ] Backup verification
- [ ] Restore test
- [ ] Document recovery procedure

## Phase 24 — Security Review

- [ ] SSH security
- [ ] Firewall
- [ ] HTTPS
- [ ] Secrets
- [ ] Password hashing
- [ ] Authentication
- [ ] Authorization
- [ ] Input validation
- [ ] Rate limiting
- [ ] CORS
- [ ] Security headers
- [ ] Database exposure
- [ ] Docker security

## Phase 25 — Production Deployment

- [ ] Complete deployment
- [ ] Verify frontend
- [ ] Verify backend
- [ ] Verify database
- [ ] Verify authentication
- [ ] Verify orders
- [ ] Verify inventory
- [ ] Verify HTTPS
- [ ] Verify backups
- [ ] Verify CI/CD

## Phase 26 — Resume Documentation

- [ ] Final architecture diagram
- [ ] Final ER diagram
- [ ] README
- [ ] API documentation
- [ ] Deployment documentation
- [ ] Security documentation
- [ ] Screenshots
- [ ] Resume bullet points
- [ ] Interview explanation
