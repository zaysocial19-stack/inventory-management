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

- [ ] Initialize repository
- [ ] Create `.gitignore`
- [ ] Create README
- [ ] Make initial commit
- [ ] Create GitHub repository
- [ ] Push repository
- [ ] Establish meaningful commit convention

## Phase 3 — Frontend Foundation

- [ ] Create React + TypeScript + Vite project
- [ ] Understand project structure
- [ ] Create initial components
- [ ] Add React Router
- [ ] Create page layout
- [ ] Learn TypeScript types/interfaces
- [ ] Create forms
- [ ] Add Tailwind CSS
- [ ] Build initial dashboard UI

## Phase 4 — Backend Foundation

- [ ] Create NestJS project
- [ ] Understand modules
- [ ] Understand controllers
- [ ] Understand services
- [ ] Understand dependency injection
- [ ] Create `/api/health`
- [ ] Add validation
- [ ] Configure API structure
- [ ] Add Swagger/OpenAPI

## Phase 5 — PostgreSQL

- [ ] Install/configure PostgreSQL for development
- [ ] Learn relational database concepts
- [ ] Design entities
- [ ] Create ER diagram
- [ ] Configure Prisma
- [ ] Create initial schema
- [ ] Run migrations
- [ ] Seed development data

## Phase 6 — Connect Backend to Database

- [ ] Connect NestJS to Prisma
- [ ] Implement Products module
- [ ] GET products
- [ ] GET product by ID
- [ ] POST product
- [ ] PATCH product
- [ ] DELETE product
- [ ] Validation
- [ ] Error handling
- [ ] Database constraints

## Phase 7 — Authentication

- [ ] User registration
- [ ] Password hashing
- [ ] Login
- [ ] Authentication state
- [ ] Protected endpoints
- [ ] Logout
- [ ] Secure credential handling

## Phase 8 — Authorization

- [ ] Define Admin role
- [ ] Define Manager role
- [ ] Define Staff role
- [ ] Implement RBAC
- [ ] Protect backend operations
- [ ] Protect frontend routes/UI appropriately

## Phase 9 — Inventory

- [ ] Inventory model
- [ ] Stock quantity
- [ ] Stock movement model
- [ ] Stock receiving
- [ ] Stock reduction
- [ ] Stock history
- [ ] Low-stock threshold
- [ ] Transaction-safe inventory updates

## Phase 10 — Orders

- [ ] Order model
- [ ] Order item model
- [ ] Create order
- [ ] Calculate totals
- [ ] Order status
- [ ] Order history
- [ ] Connect orders to inventory

## Phase 11 — Frontend/API Integration

- [ ] Create API client
- [ ] Connect authentication
- [ ] Connect products
- [ ] Connect inventory
- [ ] Connect orders
- [ ] TanStack Query
- [ ] Loading states
- [ ] Error states
- [ ] Cache invalidation

## Phase 12 — Professional UI

- [ ] Login
- [ ] Dashboard
- [ ] Products
- [ ] Inventory
- [ ] Suppliers
- [ ] Orders
- [ ] Users
- [ ] Reports
- [ ] Responsive layout
- [ ] Reusable components

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
