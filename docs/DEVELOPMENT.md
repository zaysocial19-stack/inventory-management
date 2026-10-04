# Development Guide

## Purpose

This document records how to develop the project locally.

## Development Structure

```text
inventory-management/
|
+-- frontend/
+-- backend/
+-- docs/
+-- docker-compose.yml
+-- README.md
```

## Development Principles

- Make small changes.
- Test each change.
- Commit meaningful milestones.
- Understand commands before running them.
- Keep frontend and backend responsibilities separate.
- Never commit secrets.
- Keep documentation synchronized with the real project.

## Local Development Flow

```text
Write code
   |
   v
Run locally
   |
   v
Test
   |
   v
Review
   |
   v
Git commit
   |
   v
Git push
```

## Useful Checks

Frontend:

- Start development server
- Type check
- Run tests
- Build production bundle

Backend:

- Start development server
- Type check
- Run tests
- Test API endpoints

Database:

- Check migration state
- Run migrations
- Verify seed/development data

## Git Commit Principle

Use commits that describe a logical change.

Examples:

```text
feat: add product API
feat: add login form
fix: validate stock quantity
test: add order service tests
docs: update deployment guide
chore: configure Docker Compose
```

## AI Pair-Programming Rule

The coding assistant should:

1. Explain the current task.
2. Explain the relevant concept.
3. Give me a small implementation task.
4. Review my work.
5. Help debug problems.
6. Confirm the result.
7. Update project documentation when appropriate.

Do not generate the entire application for me.
