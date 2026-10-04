# Inventory & Order Management System

## Project Goal

Build a professional full-stack Inventory & Order Management System for a small business such as a café, restaurant, or retail business.

The project is intended for a software-development resume and, more importantly, to help me master full-stack development and traditional server deployment.

## Learning Goals

Master:

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Node.js
- NestJS
- REST APIs
- PostgreSQL
- Prisma
- Authentication
- Authorization / RBAC
- Testing
- Docker
- Linux
- Nginx
- DNS
- HTTPS
- Cloudflare
- VPS deployment
- GitHub Actions / CI/CD
- Logging, monitoring, backups, and security

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS

### Backend

- Node.js
- TypeScript
- NestJS
- REST API
- OpenAPI / Swagger

### Database

- PostgreSQL
- Prisma ORM

### Infrastructure

- Hetzner Cloud VPS
- Ubuntu Linux
- Docker
- Docker Compose
- Nginx
- Cloudflare

### CI/CD

- Git
- GitHub
- GitHub Actions

### Testing

- Vitest
- React Testing Library
- Jest
- Supertest

## Architecture

```text
Users
  |
  v
Cloudflare
  |
  v
HTTPS
  |
  v
Hetzner VPS
  |
  v
Nginx
  |
  +------------------+
  |                  |
  v                  v
React Frontend     NestJS Backend
                     |
                     v
                   Prisma
                     |
                     v
                 PostgreSQL
```

## Deployment Flow

```text
Developer Laptop
      |
      v
     Git
      |
      v
   GitHub
      |
      v
GitHub Actions
      |
      +--> Lint
      +--> Type Check
      +--> Tests
      +--> Build
      |
      v
Deployment
      |
      v
Hetzner VPS
      |
      v
Docker
      |
      v
Production
```

## Learning Rule

This is a learning project.

The AI coding assistant must NOT build the entire project automatically. It should pair-program with me, explain concepts, give me manageable tasks, review my work, help me debug, and verify my understanding.

I should understand the system from browser -> HTTP -> Nginx -> NestJS -> Prisma -> PostgreSQL -> response.

## Current Status

- Current phase: Phase 2
- Current task: Initialize and configure Git repository
- Last completed task: Verified local environment (Node v24.15, npm 11.12, Git 2.53)
- Next task: Learn git init, .gitignore, initial commit, GitHub remote

## Important Decisions

- Build one professional monolithic full-stack application.
- Use React + TypeScript + Vite for the frontend.
- Use NestJS + TypeScript for the backend.
- Use PostgreSQL + Prisma for persistent data.
- Use Docker for application packaging/runtime.
- Use a Hetzner VPS for traditional deployment practice.
- Use Nginx as the public web server/reverse proxy.
- Use Cloudflare for DNS/network layer.
- Use GitHub Actions for CI/CD.
- Avoid unnecessary microservices and unnecessary dependencies.
