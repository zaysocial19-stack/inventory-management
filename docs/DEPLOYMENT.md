# Deployment

## Production Infrastructure

```text
Cloudflare
    |
    v
Hetzner Cloud VPS
    |
    v
Ubuntu Linux
    |
    +-- Nginx
    |
    +-- Docker
         |
         +-- Frontend
         +-- Backend
         +-- PostgreSQL
```

## VPS Responsibilities

The VPS runs the production application.

It should provide:

- Linux environment
- Docker runtime
- Nginx
- Application containers
- Persistent database storage
- Logs

## Initial Server Setup

Planned:

- Create Hetzner VPS
- Install/update Ubuntu packages
- Create deployment user
- Configure SSH keys
- Configure firewall
- Install Docker
- Verify Docker
- Configure application directories

## Nginx

Nginx will be the public web server and reverse proxy.

Expected routing:

```text
/       -> React frontend
/api/*  -> NestJS backend
```

## Domain

Production domain/subdomain:

```text
inventory.example.com
```

DNS will be managed through Cloudflare.

## HTTPS

Production traffic must use HTTPS.

The HTTP -> HTTPS behavior and TLS certificate configuration must be documented after implementation.

## Docker

Production services:

```text
frontend
backend
postgres
```

Use Docker Compose for local/initial production orchestration.

## Deployment Flow

```text
Developer
   |
   v
Git push
   |
   v
GitHub
   |
   v
GitHub Actions
   |
   +-- lint
   +-- typecheck
   +-- tests
   +-- build
   |
   v
Deployment
   |
   v
VPS
   |
   v
Docker
   |
   v
Production
```

## Rollback

Document the actual rollback process once CI/CD is implemented.

## Important Security Rule

Never commit:

- passwords
- private keys
- API secrets
- production database credentials
- `.env` files containing real secrets
